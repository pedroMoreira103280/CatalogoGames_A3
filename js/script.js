/* ===========================
   BASE DE DADOS DOS GAMES
   =========================== */

const games = [
    {
        id: 1,
        title: "Elden Ring",
        genre: "Ação/RPG",
        year: 2022,
        rating: 9.3,
        description: "Um épico mundo aberto criado em colaboração entre FromSoftware e George R. R. Martin. Explore um reino vasto repleto de mistérios, desafios épicos e inimigos memoráveis. Prepare-se para uma jornada desafiadora que testará seus limites.",
        details: "Desenvolvido pela renomada FromSoftware, criadores da série Dark Souls, Elden Ring traz a fórmula desafiadora para um mundo aberto. Com gráficos impressionantes, combate tático e uma narrativa profunda criada com o autor George R. R. Martin, é considerado uma obra-prima do gênero.",
        platforms: ["PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X/S", "PC"],
        features: ["Mundo aberto", "Multijogador", "Boss épicos", "Customização profunda"]
    },
    {
        id: 2,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Aventura/Ação",
        year: 2017,
        rating: 9.7,
        description: "Explore um vasto reino com liberdade total. Escale montanhas, resolva enigmas e enfrente inimigos em um jogo que redefiniu o gênero de aventuras. Uma experiência única no Nintendo Switch.",
        details: "Um divisor de águas na indústria dos games, Breath of the Wild oferece uma liberdade sem precedentes. Sem estrutura linear obrigatória, você pode explorar o mundo na ordem que desejar, resolvendo problemas criativos e descobrindo segredos em cada canto.",
        platforms: ["Nintendo Switch", "Wii U"],
        features: ["Exploração livre", "Criatividade em combate", "Enigmas únicos", "Física interativa"]
    },
    {
        id: 3,
        title: "Cyberpunk 2077",
        genre: "RPG/Ficção Científica",
        year: 2020,
        rating: 8.5,
        description: "Imerja-se em Night City, um futuro distópico repleto de ação, romance e decisões que importam. Crie seu personagem e viva uma história épica em um mundo aberto gigantesco.",
        details: "CD Projekt Red apresenta um RPG ambicioso em um mundo ciberpunk densamente construído. Com um enredo envolvente, personagens memoráveis e um sistema de escolhas que afetam a narrativa, Cyberpunk 2077 oferece dezenas de horas de gameplay variado.",
        platforms: ["PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X/S", "PC"],
        features: ["Mundo aberto gigante", "Romance e relacionamentos", "Cibernética", "Escolhas narrativas"]
    }
];

/* ===========================
   FUNÇÃO: Carrega Detalhes do Game
   =========================== */

function loadGameDetail() {
    // Obtém o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get('id'));
    
    // Encontra o game na array
    const game = games.find(g => g.id === gameId);
    
    // Se game não existe, mostra erro
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
    
    // Monta o HTML com os detalhes do game
    const platformsList = game.platforms.join(', ');
    const featuresList = game.features.map(f => `<span style="display: inline-block; background-color: #3a3a3a; padding: 0.3rem 0.8rem; border-radius: 20px; margin-right: 0.5rem; margin-bottom: 0.5rem;">${f}</span>`).join('');
    
    const htmlContent = `
        <div class="detail-header">
            <h2>${game.title}</h2>
            <span class="genre">${game.genre} • ${game.year}</span>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <span style="font-size: 1.5rem; color: #00a8ff;">⭐ ${game.rating}</span>
                <span style="color: #b0b0b0;">/ 10</span>
            </div>
        </div>
        
        <div class="detail-image">
            🎮 ${game.title}
        </div>
        
        <div class="detail-description">
            <h3>Sinopse</h3>
            <p>${game.description}</p>
        </div>
        
        <div class="detail-description">
            <h3>Detalhes Completos</h3>
            <p>${game.details}</p>
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
                <span>⭐ ${game.rating}/10</span>
            </div>
        </div>
        
        <div style="background-color: #2d2d2d; padding: 2rem; border-radius: 8px; margin-top: 2rem; border: 1px solid #3a3a3a;">
            <h3 style="color: #00a8ff; margin-bottom: 1rem;">Características Principais</h3>
            <div>${featuresList}</div>
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
    // Atualiza navegação ativa
    updateActiveNav();
    
    // Carrega detalhes do game se estiver na página de detalhes
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