const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const IGDB_URL = 'https://api.igdb.com/v4/games';
const IGDB_AUTH = 'Bearer 3zr3f9m1j85pnmnarnjxpcbqqefjys';
const IGDB_CLIENT_ID = 'ta6wq166u7fefmeyb24a2va8h1qyi3';

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

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
  console.log('Acesse a aplicação via browser e use /api/game?id=<ID> para testar o proxy.');
});
