/* ===========================
   BASE DE DADOS DOS GAMES
   =========================== */

const games = [
    {
        id: 141114,
        title: "007 First Light",
        genre: "Ação/Espionagem",
        year: 2026,
        youtubeId: 'gDvbGANDH4E',
        description: "007 First Light é um emocionante jogo de ação e aventura de espionagem da IO Interactive. Acompanhe James Bond como um jovem, engenhoso e, às vezes, imprudente recruta no programa de treinamento do MI6.",
        platforms: ["PlayStation 5", "Xbox Series X/S", "PC"],
        features: ["Mundo aberto", "Multijogador", "Boss épicos", "Customização profunda"]
    },
    {
        id: 7346,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Aventura/Ação",
        year: 2017,
        youtubeId: 'zw47_q9wbBE',
        description: "Explore um vasto reino com liberdade total. Escale montanhas, resolva enigmas e enfrente inimigos em um jogo que redefiniu o gênero de aventuras.",
        platforms: ["Nintendo Switch", "Wii U"],
        features: ["Exploração livre", "Criatividade em combate", "Enigmas únicos", "Física interativa"]
    },
    {
        id: 1877,
        title: "Cyberpunk 2077",
        genre: "RPG/Ficção Científica",
        year: 2020,
        youtubeId: '8X2kIfS6fb8',
        description: "Imerja-se em Night City, um futuro distópico repleto de ação, romance e decisões que importam.",
        platforms: ["PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X/S", "PC"],
        features: ["Mundo aberto gigante", "Romance e relacionamentos", "Cibernética", "Escolhas narrativas"]
    }
];

/* ===========================
   FUNÇÃO: Busca dados externos do IGDB
   =========================== */

async function fetchExternalGameData(gameId) {
    try {
        const response = await fetch(`/api/game?id=${gameId}`);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || response.statusText);
        }

        const data = await response.json();
        return {
            aggregated_rating: typeof data.aggregated_rating === 'number' ? data.aggregated_rating : null,
            url: data.url || null
        };
    } catch (error) {
        console.error('Erro ao buscar dados externos do jogo:', error);
        return { aggregated_rating: null, url: null };
    }
}

/* ===========================
   FUNÇÃO: Monta mídia de capa ou vídeo incorporado
   =========================== */

function buildMediaHtml(game, externalData) {
    const createYoutubeEmbed = (videoId) => `
        <div class="detail-image" style="height:auto; padding:0;">
            <div class="video-wrapper" style="position:relative; width:100%; max-width:900px; margin:0 auto; padding-top:56.25%; border-radius:8px; overflow:hidden;">
                <iframe src="https://www.youtube.com/embed/${videoId}" title="${game.title} trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"></iframe>
            </div>
        </div>`;

    if (game.youtubeId) {
        return createYoutubeEmbed(game.youtubeId);
    }

    if (externalData.url) {
        const ytMatch = externalData.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        if (ytMatch) {
            return createYoutubeEmbed(ytMatch[1]);
        }
    }

    return `
        <div class="detail-image">
            <img src="images/game${game.id}.jpg" alt="${game.title}" onerror="this.style.display='none'">
            <div class="placeholder">${game.title}</div>
        </div>`;
}

/* ===========================
   FUNÇÃO: Carrega Detalhes do Game
   =========================== */

async function loadGameDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get('id'), 10);
    const game = games.find(g => g.id === gameId);

    if (!game) {
        document.getElementById('game-content').innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: #ff6b6b;">Game não encontrado</h2>
                <p style="color: #b0b0b0; margin: 1rem 0;">O jogo que você procura não existe em nosso catálogo.</p>
                <a href="index.html" class="btn-details" style="display: inline-block; margin-top: 1rem;">Voltar para Home</a>
            </div>
        `;
        return;
    }

    const externalData = await fetchExternalGameData(gameId);
    const displayedRating = externalData.aggregated_rating !== null ? externalData.aggregated_rating.toFixed(1) : game.rating;
    const detailsButton = externalData.url ? `<a href="${externalData.url}" target="_blank" rel="noopener noreferrer" class="btn-details" style="margin-top: 1rem;">Mais detalhes</a>` : '';

    const platformsList = game.platforms.join(', ');
    const featuresList = game.features.map(f => `<span style="display: inline-block; background-color: #3a3a3a; padding: 0.3rem 0.8rem; border-radius: 20px; margin-right: 0.5rem; margin-bottom: 0.5rem;">${f}</span>`).join('');
    const mediaHtml = buildMediaHtml(game, externalData);

    const htmlContent = `
        <div class="detail-header">
            <h2>${game.title}</h2>
            <span class="genre">${game.genre} • ${game.year}</span>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <span style="font-size: 1.5rem; color: #00a8ff;">⭐ ${displayedRating}</span>
                <span style="color: #b0b0b0;">/ 100</span>
            </div>
        </div>

        ${mediaHtml}

        <div class="detail-description">
            <h3>Sinopse</h3>
            <p>${game.description}</p>
        </div>

        <div class="detail-specs">
            <div class="spec-item">
                <strong>Plataformas</strong>
                <span>${platformsList}</span>
            </div>
            <div class="spec-item">
                <strong>Ano de Lançamento</strong>
                <span>${game.year}</span>
            </div>
            <div class="spec-item">
                <strong>Classificação</strong>
                <span>⭐ ${displayedRating}/100</span>
            </div>
        </div>

        <div style="background-color: #2d2d2d; padding: 2rem; border-radius: 8px; margin-top: 2rem; border: 1px solid #3a3a3a;">
            <h3 style="color: #00a8ff; margin-bottom: 1rem;">Características Principais</h3>
            <div>${featuresList}</div>
            ${detailsButton}
        </div>
    `;

    document.getElementById('game-content').innerHTML = htmlContent;
}

/* ===========================
   FUNÇÃO: Atualiza Link Ativo na Navegação
   =========================== */

function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ===========================
   INICIALIZAÇÃO
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    updateActiveNav();

    if (window.location.pathname.includes('game-detail.html')) {
        loadGameDetail();
    }
});

/* ===========================
   API DE NOTICIAS
   =========================== */
// Variáveis para controle de paginação
let paginaAtual = 1;
const noticiasPorPagina = 10;
const maxPaginas = 10; // limite da API

// Função para buscar notícias da API
async function buscarNoticias(pagina = 1) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=jogos&pageSize=${noticiasPorPagina}&page=${pagina}&apiKey=cc9e5f5b76164b4cbf1388cebab1b323`
    );

    const data = await response.json();
// Verifica se a resposta contém artigos
    if (!data.articles) {
      console.error("API não retornou artigos");
      return;
    }

// Limpa o container antes de adicionar novas notícias
    const container = document.getElementById("listaNoticias");
    container.innerHTML = "";

// Adiciona cada notícia ao container
    data.articles.forEach(noticia => {
        // Cria um card para cada notícia
      const card = document.createElement("div");
      card.classList.add("news-article");

        // Usa imagem da notícia ou placeholder se não houver
      const imagem = document.createElement("img");
      imagem.src = noticia.urlToImage || "https://via.placeholder.com/300x150";
      imagem.alt = noticia.title;

        // Cria um link para o título da notícia
      const titulo = document.createElement("a");
      titulo.href = noticia.url;
      titulo.textContent = noticia.title;
      titulo.target = "_blank";

        // Cria um parágrafo para a descrição da notícia
      const descricao = document.createElement("p");
      descricao.textContent = noticia.description || "Sem descrição";

        // Adiciona imagem, título e descrição ao card
      card.appendChild(imagem);
      card.appendChild(titulo);
      card.appendChild(descricao);

        // Adiciona o card ao container
      container.appendChild(card);
    });
    // Atualiza o número da página
    document.getElementById("numeroPagina").innerText = pagina;

    // Scroll
    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (erro) {
    console.error("Erro:", erro);
  }
}
    // Funções para navegação entre páginas
function proximaPagina() {
  if (paginaAtual < maxPaginas) {
    paginaAtual++;
    buscarNoticias(paginaAtual);
  }
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    buscarNoticias(paginaAtual);
  }
}

// inicialização função buscar Noticias
buscarNoticias(paginaAtual);