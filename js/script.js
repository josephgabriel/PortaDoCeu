document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("search-input");

    let categoriaAtiva = "inicio";

    // Mapeamento para exibir nomes bonitos nas seções do HTML
    const nomesCategorias = {
        jesus: "Jesus",
        familia: "Sagrada Família",
        maria: "Virgem Maria",
        anjos: "Anjos",
        jose: "São José",
        santos: "Santos e Beatos",
        biblia: "Trechos Bíblicos",
        quaresma: "Quaresma",
        advento: "Advento",
        infantil: "Santinhos",
        suportes: "Suportes e Toalhas"
    };

    // 1. Cria a estrutura das seções baseando-se APENAS nos produtos que existem de fato
    function construirEstruturaInicial() {
        if (!mainContent) return;
        mainContent.innerHTML = "";

        // Pega as categorias únicas do arquivo produtos.js
        const categoriasUnicas = [...new Set(produtos.map(p => p.categoria))];

        if (categoriasUnicas.length === 0) {
            mainContent.innerHTML = "<p style='text-align:center; padding:20px; color:#888;'>Nenhum produto cadastrado no banco de dados.</p>";
            return;
        }

        categoriasUnicas.forEach(cat => {
            // Se não encontrar o nome bonito no mapeamento, usa o próprio termo do ID com a primeira letra maiúscula
            const nomeExibicao = nomesCategorias[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));

            const secaoHtml = `
                <div class="category-section" id="section-${cat}" data-section="${cat}">
                    <div class="title">
                        <h2>${nomeExibicao}</h2>
                        <a href="#" class="ver-tudo-btn" data-target="${cat}">Ver tudo</a>
                    </div>
                    <div class="products" id="grid-${cat}"></div>
                </div>
            `;
            mainContent.insertAdjacentHTML("beforeend", secaoHtml);
        });
    }

    // 2. Renderiza os cards e gerencia a exibição das seções
    function atualizarInterface() {
        const termoBusca = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const grids = document.querySelectorAll(".products");
        
        // Limpa os grids antigos
        grids.forEach(grid => grid.innerHTML = "");

        const temProdutosNaBusca = {};

        // Injeta os cards onde eles pertencem
        produtos.forEach(produto => {
            const atendeBusca = produto.nome.toLowerCase().includes(termoBusca);

            if (atendeBusca) {
                const grid = document.getElementById(`grid-${produto.categoria}`);
                if (grid) {
                    temProdutosNaBusca[produto.categoria] = true;
                    
                    const card = `
                         <a href="produto.html?id=${produto.id}" class="card-link" style="text-decoration: none; color: inherit;">
                             <div class="card">
                                 <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://placehold.co/180x180?text=${encodeURIComponent(produto.nome)}'">
                                 <h3>${produto.nome}</h3>
                                 <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                             </div>
                         </a>
                    `;
                    grid.insertAdjacentHTML("beforeend", card);
                }
            }
        });

        // Controla o display (block/none) de cada bloco de categoria
        document.querySelectorAll(".category-section").forEach(secao => {
            const categoriaDaSecao = secao.getAttribute("data-section");
            
            const correspondeAabaAtiva = (categoriaAtiva === "inicio" || categoriaAtiva === categoriaDaSecao);
            const possuiProdutosValidos = temProdutosNaBusca[categoriaDaSecao] === true;

            if (correspondeAabaAtiva && possuiProdutosValidos) {
                secao.style.display = "block";
            } else {
                secao.style.display = "none";
            }
        });
    }

    // 3. Configura os cliques dos botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");

            categoriaAtiva = e.target.getAttribute("data-category");
            atualizarInterface();
            
            const phoneContainer = document.querySelector(".phone");
            if (phoneContainer) phoneContainer.scrollTop = 0;
        });
    });

    // Atalho do link "Ver tudo"
    if (mainContent) {
        mainContent.addEventListener("click", (e) => {
            if (e.target.classList.contains("ver-tudo-btn")) {
                e.preventDefault();
                const alvo = e.target.getAttribute("data-target");
                const botaoCorrespondente = document.querySelector(`.filter-btn[data-category="${alvo}"]`);
                if (botaoCorrespondente) botaoCorrespondente.click();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", atualizarInterface);
    }

    // Inicialização segura
    construirEstruturaInicial();
    atualizarInterface();
});