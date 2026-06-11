const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const IGDB_URL = 'https://api.igdb.com/v4/games';
const IGDB_AUTH = process.env.IGDB_AUTH;
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.use(express.static(path.join(__dirname)));

app.get('/api/game', async (req, res) => {
  const gameId = parseInt(req.query.id, 10);

  if (!gameId) {
    return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
  }

  try {
    const response = await fetch(IGDB_URL, {
      method: 'POST',
      headers: {
        'Authorization': IGDB_AUTH,
        'Client-ID': IGDB_CLIENT_ID,
        'Content-Type': 'text/plain'
      },
      body: `fields aggregated_rating, url; where id = ${gameId};`
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text || response.statusText });
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: 'Game não encontrado' });
    }

    return res.json(data[0]);
  } catch (error) {
    console.error('Erro ao buscar game da API IGDB:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar dados do IGDB' });
  }
});

app.get('/api/news', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;

  if (!NEWS_API_KEY) {
    return res.status(500).json({ error: 'NEWS_API_KEY nao configurada no servidor' });
  }

  try {
    const params = new URLSearchParams({
      q: 'jogos',
      pageSize: String(pageSize),
      page: String(page),
      apiKey: NEWS_API_KEY
    });

    const response = await fetch(`${NEWS_API_URL}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar noticias da NewsAPI:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar noticias' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
  console.log('Acesse a aplicação via browser e use /api/game?id=<ID> para testar o proxy.');
});
