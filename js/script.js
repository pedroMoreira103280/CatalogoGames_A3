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
    const gamesList = getGames();
    const game = gamesList.find(g => g.id === gameId);

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
   SISTEMA DE AUTENTICAÇÃO
   =========================== */

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    
    // Reset erro
    if(errorMsg) errorMsg.style.display = 'none';

    // Validação estática
    if (email === 'admin@gamecatalog.com' && password === 'admin123') {
        sessionStorage.setItem('userAuth', JSON.stringify({ role: 'admin', name: 'Administrador' }));
        window.location.href = 'admin.html';
    } else if (email === 'user@gamecatalog.com' && password === 'user123') {
        sessionStorage.setItem('userAuth', JSON.stringify({ role: 'user', name: 'Usuário Comum' }));
        window.location.href = 'index.html';
    } else {
        if(errorMsg) {
            errorMsg.innerText = 'E-mail ou senha incorretos.';
            errorMsg.style.display = 'block';
        } else {
            alert('E-mail ou senha incorretos.');
        }
    }
}

function logout() {
    sessionStorage.removeItem('userAuth');
    window.location.href = 'index.html';
}

function getUser() {
    const authData = sessionStorage.getItem('userAuth');
    return authData ? JSON.parse(authData) : null;
}

// Verifica acesso em rotas protegidas
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const user = getUser();
    
    if (currentPage === 'admin.html') {
        if (!user || user.role !== 'admin') {
            window.location.href = 'login.html';
        }
    }
}

/* ===========================
   SISTEMA DE GERENCIAMENTO (CRUD)
   =========================== */

function getGames() {
    const localGames = localStorage.getItem('games');
    if (localGames) {
        return JSON.parse(localGames);
    }
    // Se não tiver no localStorage, salva e retorna a constante 'games' inicial
    localStorage.setItem('games', JSON.stringify(games));
    return games;
}

function saveGames(gamesArray) {
    localStorage.setItem('games', JSON.stringify(gamesArray));
}

function loadAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;
    
    const gamesList = getGames();
    let html = '';
    
    gamesList.forEach(game => {
        html += `
            <div class="admin-table-row">
                <div class="col">${game.id}</div>
                <div class="col">${game.title}</div>
                <div class="col">${game.genre}</div>
                <div class="col">
                    <button class="btn-action btn-edit" style="background-color: var(--accent-color); color: #fff; padding: 0.3rem 0.8rem; border: none; border-radius: 4px; cursor: pointer;" onclick="openEditModal(${game.id})">Editar</button>
                </div>
            </div>
        `;
    });
    
    tbody.innerHTML = html;
}

let currentEditId = null;

function openEditModal(id) {
    const gamesList = getGames();
    const game = gamesList.find(g => g.id === id);
    if (!game) return;
    
    currentEditId = id;
    document.getElementById('edit-title').value = game.title;
    document.getElementById('edit-genre').value = game.genre;
    
    document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    currentEditId = null;
}

function saveGameEdit(e) {
    e.preventDefault();
    
    if (currentEditId === null) return;
    
    const title = document.getElementById('edit-title').value;
    const genre = document.getElementById('edit-genre').value;
    
    const gamesList = getGames();
    const index = gamesList.findIndex(g => g.id === currentEditId);
    
    if (index !== -1) {
        gamesList[index].title = title;
        gamesList[index].genre = genre;
        
        saveGames(gamesList);
        closeEditModal();
        loadAdminTable();
        alert('Jogo atualizado com sucesso!');
    }
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

    // Atualiza estado do botão Login/Sair
    const loginBtn = document.querySelector('.btn-login') || document.querySelector('a[href="login.html"]');
    const user = getUser();
    if (loginBtn) {
        if (user) {
            // Adiciona o link do Painel ADM caso o usuário seja admin e ele não exista na tela
            if (user.role === 'admin' && !document.querySelector('a[href="admin.html"]')) {
                const adminLi = document.createElement('li');
                adminLi.innerHTML = '<a href="admin.html">Painel ADM</a>';
                const ul = loginBtn.closest('ul');
                if (ul) {
                    ul.insertBefore(adminLi, loginBtn.closest('li'));
                }
            }

            loginBtn.innerText = 'Sair';
            loginBtn.href = '#';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                logout();
            };
        } else {
            loginBtn.innerText = 'Login';
            loginBtn.href = 'login.html';
            loginBtn.onclick = null;
        }
    }
}

/* ===========================
   FUNÇÃO: Carrega Games na Home
   =========================== */

function loadHomeGames() {
    const grid = document.getElementById('home-games-grid');
    if (!grid) return;
    
    const games = getGames();
    let html = '';
    
    games.forEach((game) => {
        html += `
            <div class="game-card">
                <div class="game-image" style="background-color: #2a2a2a;">
                    <img src="images/game${game.id}.jpg" alt="${game.title}" onerror="this.style.display='none'">
                </div>
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <p class="genre">${game.genre}</p>
                    <p class="description">${game.description}</p>
                    <a href="game-detail.html?id=${game.id}" class="btn-details">Ver Detalhes</a>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

/* ===========================
   FUNÇÃO: Carrega Notícias
   =========================== */

function loadNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    
    const games = getGames();
    // Pega o nome do jogo 1 e 3 para ser usado dinamicamente na notícia, ou um nome genérico se não existir
    const game1Title = games.length > 0 ? games[0].title : 'Elden Ring';
    const game3Title = games.length > 2 ? games[2].title : 'Cyberpunk';
    
    grid.innerHTML = `
        <div class="game-card">
            <div class="game-info">
                <h3>Atualização de ${game1Title}</h3>
                <p class="genre">Data: Hoje</p>
                <p class="description">A desenvolvedora anunciou hoje uma grande atualização trazendo novos modos de jogo e correções de balanceamento esperadas pelos fãs.</p>
                <a href="https://store.steampowered.com/news/app/3768760/view/693136511334351582" class="btn-details">Ler mais</a>
            </div>
        </div>
        <div class="game-card">
            <div class="game-info">
                <h3>Promoção de Fim de Ano</h3>
                <p class="genre">Data: Ontem</p>
                <p class="description">Aproveite as ofertas incríveis de fim de ano nas principais lojas digitais com descontos de até 80% em grandes títulos.</p>
                <a href="https://store.steampowered.com/" class="btn-details">Ler mais</a>
            </div>
        </div>
        <div class="game-card">
            <div class="game-info">
                <h3>Anúncio Surpresa: ${game3Title} 2</h3>
                <p class="genre">Data: 2 dias atrás</p>
                <p class="description">O estúdio lançou um teaser misterioso sugerindo a continuação direta para a próxima geração de consoles.</p>
                <a href="https://www.omelete.com.br/games/cyberpunk-2-continuacao-de-cyberpunk-2077-ganha-titulo-e-entra-em-pre-producao" class="btn-details">Ler mais</a>
            </div>
        </div>
    `;
}

/* ===========================
   INICIALIZAÇÃO
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateActiveNav();
    const pathname = window.location.pathname;
    
    if (pathname.includes('game-detail.html')) {
        loadGameDetail();
    } else if (pathname.includes('admin.html')) {
        loadAdminTable();
        // Setup Modal Events
        const editForm = document.getElementById('edit-form');
        if(editForm) {
            editForm.addEventListener('submit', saveGameEdit);
        }
    } else if (pathname.includes('news.html')) {
        loadNews();
        buscarNoticias(paginaAtual);
    } else if (pathname === '/' || pathname.includes('index.html')) {
        loadHomeGames();
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
      `/api/news?pageSize=${noticiasPorPagina}&page=${pagina}`
    );

    const data = await response.json();
// Verifica se a resposta contém artigos
    if (!data.articles) {
      console.error("API não retornou artigos", data);
      return;
    }

// Limpa o container antes de adicionar novas notícias
    const container = document.getElementById("listaNoticias");
    if (!container) return;
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

// (Removida a chamada global solta - agora é iniciada no DOMContentLoaded)
