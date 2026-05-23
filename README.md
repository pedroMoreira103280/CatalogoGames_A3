# 🎮 Catálogo de Games - A3 IHC

Um site simples e minimalista de catálogo de games, desenvolvido com HTML, CSS e JavaScript puro. Perfeito para estudantes de programação aprender conceitos fundamentais.

## 📋 Características

✅ **3 Páginas Acessíveis:**
- **Home** (`index.html`) - Lista os 3 games em destaque
- **Detalhes do Game** (`game-detail.html`) - Mostra informações completas de cada jogo
- **Sobre** (`about.html`) - Informações sobre o projeto

✅ **Design Minimalista:**
- Tema escuro e moderno
- Sem animações excessivas
- Responsivo (funciona em celular, tablet e desktop)
- Fácil de navegar

✅ **Tecnologia Simples:**
- HTML5 semântico
- CSS3 limpo e organizado
- JavaScript básico e compreensível
- **Zero dependências externas**

## 📁 Estrutura do Projeto

```
CatalogoGames_A3/
├── index.html              # Página inicial com lista de games
├── game-detail.html        # Página de detalhes do game
├── about.html              # Página sobre o projeto
├── css/
│   └── styles.css          # Estilos do site
├── js/
│   └── script.js           # Lógica do site
├── images/                 # Pasta para imagens (deixe em branco)
└── README.md              # Este arquivo
```

## 🚀 Como Usar

### Opção 1: Abrir Diretamente no Navegador
1. Abra a pasta `CatalogoGames_A3` no explorador de arquivos
2. Clique com botão direito em `index.html`
3. Selecione "Abrir com" e escolha seu navegador

### Opção 2: Usar um Servidor Local (Recomendado)

**Com Python 3:**
```bash
# Na pasta do projeto
python -m http.server 8000
```

**Com Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Com Node.js:**
```bash
# Instale globalmente (uma única vez)
npm install -g http-server

# Na pasta do projeto
http-server
```

Depois acesse: `http://localhost:8000`

## 📝 Como Modificar o Projeto

### 1. Adicionar Novos Games

Abra `js/script.js` e adicione um novo objeto na array `games`:

```javascript
{
    id: 4,
    title: "Nome do Jogo",
    genre: "Gênero",
    year: 2024,
    rating: 8.5,
    description: "Descrição curta do jogo",
    details: "Descrição detalhada do jogo",
    platforms: ["Platform 1", "Platform 2"],
    features: ["Recurso 1", "Recurso 2"]
}
```

Depois, na `index.html`, adicione um novo `game-card`:

```html
<div class="game-card">
    <div class="game-image" style="background-color: #1a2a3a;">
        <img src="images/game4.jpg" alt="Nome do Jogo" onerror="this.style.display='none'">
        <div class="placeholder">Nome do Jogo</div>
    </div>
    <div class="game-info">
        <h3>Nome do Jogo</h3>
        <p class="genre">Gênero</p>
        <p class="description">Descrição curta aqui...</p>
        <a href="game-detail.html?id=4" class="btn-details">Ver Detalhes</a>
    </div>
</div>
```

### 2. Alterar Cores

Em `css/styles.css`, no início do arquivo estão as variáveis de cores:

```css
:root {
    --primary-color: #1a1a1a;        /* Cor de fundo principal */
    --secondary-color: #2d2d2d;      /* Cor de fundo secundária */
    --accent-color: #00a8ff;         /* Cor destaque (azul) */
    --text-color: #ffffff;           /* Cor do texto */
    --text-secondary: #b0b0b0;       /* Cor do texto secundário */
    --border-color: #3a3a3a;         /* Cor das bordas */
}
```

Basta alterar os valores hexadecimais!

### 3. Adicionar Imagens

1. Coloque as imagens dos games na pasta `images/`
2. Altere o caminho em cada `game-card`:

```html
<img src="images/meu-game.jpg" alt="Nome do Jogo">
```

### 4. Mudar Fonte ou Espaçamento

Em `css/styles.css`:

```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  /* Altere a fonte aqui */
    line-height: 1.6;  /* Altere o espaçamento entre linhas */
}
```

## 💡 Conceitos de Aprendizado

Este projeto é ótimo para aprender:

- **HTML** - Estrutura semântica (`nav`, `header`, `main`, `footer`)
- **CSS** - Grid, Flexbox, variáveis CSS, media queries
- **JavaScript** - DOM manipulation, URLSearchParams, arrays e objetos
- **Navegação** - Passagem de parâmetros via URL (`?id=1`)
- **Responsividade** - Design que funciona em qualquer tela
- **Boas Práticas** - Código limpo e bem organizado

## 🎯 Desafios para Aprender Mais

1. **Adicionar filtro por gênero** - Filtre games por tipo
2. **Sistema de favoritos** - Use localStorage para salvar jogos favoritos
3. **Busca** - Adicione um campo de busca
4. **Comentários** - Permita comentários nos games
5. **Classificação por estrelas** - Sistema interativo de avaliação

## 📱 Responsividade

O site funciona perfeitamente em:
- ✅ Celulares (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1200px+)

## 🔧 Troubleshooting

**P: As imagens não carregam?**
- R: É normal! As imagens estão vazias. Você pode:
  - Adicionar suas próprias imagens na pasta `images/`
  - Usar URLs de imagens externas
  - Manter os placeholders (funcionam sem imagens)

**P: Os links não funcionam?**
- R: Certifique-se de abrir através de um servidor HTTP (não arquivo local)

**P: Quero adicionar mais de 3 games?**
- R: Sem problemas! Siga o tutorial "Como Modificar" acima

## 📚 Referências Úteis

- [MDN - HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- [MDN - CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- [MDN - JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

## 📄 Licença

Este projeto é livre para usar e modificar para fins educacionais.

---

**Desenvolvido para a disciplina A3 IHC - Unicuritiba** 🎓

Atividade A3 Interação humano computador | Divirta-se criando seu próprio catálogo de games! 🎮
