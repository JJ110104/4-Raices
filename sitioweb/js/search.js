// ===== SISTEMA DE BÚSQUEDA Y FILTROS =====
// Funcionalidad: Búsqueda en tiempo real con filtros por categoría

class SearchSystem {
  constructor() {
    this.searchInput = document.getElementById("searchInput")
    this.searchBtn = document.getElementById("searchBtn")
    this.filterBtns = document.querySelectorAll(".filter-btn")
    this.allItems = this.getAllSearchableItems()
    this.currentFilter = "all"

    this.init()
  }

  init() {
    this.setupEvents()
    this.createSearchResults()
  }

  setupEvents() {
    // Búsqueda en tiempo real
    this.searchInput.addEventListener("input", () => {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.performSearch()
      }, 300)
    })

    // Búsqueda con botón
    this.searchBtn.addEventListener("click", () => this.performSearch())

    // Enter para buscar
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.performSearch()
    })

    // Filtros por categoría
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setActiveFilter(btn)
        this.performSearch()
      })
    })
  }

  getAllSearchableItems() {
    const items = []

    // Tarjetas principales
    document.querySelectorAll(".tarjeta").forEach((card) => {
      const title = card.querySelector("h5").textContent
      const description = card.querySelector("p").textContent
      const category = card.dataset.category || "general"
      const image = card.querySelector("img").src

      items.push({
        title,
        description,
        category,
        image,
        element: card,
        type: "card",
      })
    })

    // Productos del menú
    document.querySelectorAll(".producto").forEach((product) => {
      const title = product.querySelector(".nombre").textContent
      const description = product.querySelector(".descripcion").textContent
      const image = product.querySelector("img").src
      const section = product.closest("section")
      let category = "menu"

      // Determinar categoría por sección
      const categoryHeader = section.querySelector(".categoria")
      if (categoryHeader) {
        const categoryText = categoryHeader.textContent.toLowerCase()
        if (categoryText.includes("café") || categoryText.includes("coffee")) {
          category = "cafe"
        } else if (categoryText.includes("panadería") || categoryText.includes("pan")) {
          category = "panaderia"
        } else if (categoryText.includes("pastelería") || categoryText.includes("postre")) {
          category = "postres"
        }
      }

      items.push({
        title,
        description,
        category,
        image,
        element: product,
        type: "product",
      })
    })

    return items
  }

  createSearchResults() {
    // Crear contenedor para resultados de búsqueda
    const resultsContainer = document.createElement("div")
    resultsContainer.id = "searchResults"
    resultsContainer.className = "search-results"
    resultsContainer.style.display = "none"

    // Insertar después del contenedor de búsqueda
    const searchContainer = document.querySelector(".search-container")
    searchContainer.parentNode.insertBefore(resultsContainer, searchContainer.nextSibling)
  }

  performSearch() {
    const searchTerm = this.searchInput.value.toLowerCase().trim()
    const resultsContainer = document.getElementById("searchResults")

    if (searchTerm === "") {
      resultsContainer.style.display = "none"
      this.showAllItems()
      return
    }

    const filteredItems = this.allItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm)

      const matchesFilter = this.currentFilter === "all" || item.category === this.currentFilter

      return matchesSearch && matchesFilter
    })

    this.displayResults(filteredItems, searchTerm)
    this.highlightOriginalItems(filteredItems)
    this.playSearchSound()
  }

  displayResults(items, searchTerm) {
    const resultsContainer = document.getElementById("searchResults")

    if (items.length === 0) {
      resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No se encontraron resultados</h3>
                    <p>No encontramos productos que coincidan con "${searchTerm}"</p>
                    <p>Intenta con otros términos como "café", "pan" o "postre"</p>
                </div>
            `
    } else {
      resultsContainer.innerHTML = `
                <div class="results-header">
                    <h3>🔍 Resultados de búsqueda (${items.length})</h3>
                    <p>Mostrando resultados para: "${searchTerm}"</p>
                </div>
                <div class="results-grid">
                    ${items.map((item) => this.createResultItem(item, searchTerm)).join("")}
                </div>
            `
    }

    resultsContainer.style.display = "block"
    resultsContainer.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  createResultItem(item, searchTerm) {
    const highlightedTitle = this.highlightText(item.title, searchTerm)
    const highlightedDescription = this.highlightText(item.description, searchTerm)

    return `
            <div class="result-item" data-category="${item.category}">
                <div class="result-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="result-content">
                    <h4>${highlightedTitle}</h4>
                    <p>${highlightedDescription}</p>
                    <div class="result-meta">
                        <span class="result-category">${this.getCategoryDisplayName(item.category)}</span>
                        <button class="view-item-btn" onclick="searchSystem.scrollToItem('${item.type}', '${item.title}')">
                            Ver Producto
                        </button>
                    </div>
                </div>
            </div>
        `
  }

  highlightText(text, searchTerm) {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm})`, "gi")
    return text.replace(regex, "<mark>$1</mark>")
  }

  getCategoryDisplayName(category) {
    const names = {
      cafe: "☕ Café",
      panaderia: "🥖 Panadería",
      postres: "🍰 Postres",
      menu: "📋 Menú",
      general: "🏪 General",
    }
    return names[category] || category
  }

  setActiveFilter(activeBtn) {
    this.filterBtns.forEach((btn) => btn.classList.remove("active"))
    activeBtn.classList.add("active")
    this.currentFilter = activeBtn.dataset.filter
  }

  highlightOriginalItems(filteredItems) {
    // Ocultar todos los elementos
    this.allItems.forEach((item) => {
      item.element.style.display = "none"
    })

    // Mostrar solo los elementos que coinciden
    filteredItems.forEach((item) => {
      item.element.style.display = "block"
      item.element.classList.add("search-highlight")
    })
  }

  showAllItems() {
    this.allItems.forEach((item) => {
      item.element.style.display = "block"
      item.element.classList.remove("search-highlight")
    })
  }

  scrollToItem(type, title) {
    const item = this.allItems.find((i) => i.type === type && i.title === title)
    if (item) {
      item.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })

      // Efecto de parpadeo para destacar
      item.element.style.animation = "highlight-flash 2s ease"
      setTimeout(() => {
        item.element.style.animation = ""
      }, 2000)
    }
  }

  playSearchSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/search.mp3")
      audio.volume = 0.2
      audio.play().catch(() => {})
    }
  }
}

// CSS adicional para los resultados de búsqueda
const searchStyles = `
.search-container {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9));
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-medium);
    margin: 30px auto;
    max-width: 1000px;
    backdrop-filter: blur(10px);
}

.search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.search-box input {
    flex: 1;
    padding: 12px 20px;
    border: 2px solid var(--color-accent);
    border-radius: 25px;
    font-size: 1rem;
    outline: none;
    transition: var(--transition-fast);
}

.search-box input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 20px rgba(111, 78, 55, 0.2);
}

.search-box button {
    background: linear-gradient(135deg, var(--color-primary), var(--color-brown-dark));
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    transition: var(--transition-fast);
}

.search-box button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
}

.search-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-btn {
    background: white;
    border: 2px solid var(--color-accent);
    color: var(--color-brown-dark);
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: var(--transition-fast);
    font-weight: bold;
}

.filter-btn:hover,
.filter-btn.active {
    background: var(--color-accent);
    color: white;
    transform: translateY(-2px);
}

.search-results {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-strong);
    margin: 30px auto;
    max-width: 1200px;
    overflow: hidden;
}

.results-header {
    background: linear-gradient(135deg, var(--color-primary), var(--color-brown-dark));
    color: white;
    padding: 20px;
    text-align: center;
}

.results-header h3 {
    margin: 0 0 10px 0;
    font-size: 1.5rem;
}

.results-header p {
    margin: 0;
    opacity: 0.9;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    padding: 30px;
}

.result-item {
    display: flex;
    background: #f8f9fa;
    border-radius: var(--border-radius-small);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    transition: var(--transition-fast);
}

.result-item:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-medium);
}

.result-image {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
}

.result-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.result-content {
    padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.result-content h4 {
    margin: 0 0 8px 0;
    color: var(--color-brown-dark);
    font-size: 1.1rem;
}

.result-content p {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
    flex: 1;
}

.result-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.result-category {
    background: var(--color-accent);
    color: var(--color-brown-dark);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
}

.view-item-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition-fast);
    font-size: 0.9rem;
}

.view-item-btn:hover {
    background: var(--color-brown-dark);
    transform: translateY(-1px);
}

.no-results {
    text-align: center;
    padding: 60px 20px;
    color: #666;
}

.no-results h3 {
    color: var(--color-brown-dark);
    margin-bottom: 15px;
}

.no-results p {
    margin: 10px 0;
    line-height: 1.6;
}

mark {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    color: var(--color-brown-dark);
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: bold;
}

.search-highlight {
    animation: search-glow 1s ease;
    border: 2px solid var(--color-accent) !important;
}

@keyframes search-glow {
    0% { box-shadow: 0 0 5px var(--color-accent); }
    50% { box-shadow: 0 0 20px var(--color-accent); }
    100% { box-shadow: var(--shadow-medium); }
}

@keyframes highlight-flash {
    0%, 100% { background: transparent; }
    25%, 75% { background: rgba(231, 186, 145, 0.3); }
    50% { background: rgba(231, 186, 145, 0.5); }
}

@media (max-width: 768px) {
    .search-container {
        margin: 20px;
        padding: 20px;
    }
    
    .search-filters {
        gap: 5px;
    }
    
    .filter-btn {
        padding: 6px 12px;
        font-size: 0.9rem;
    }
    
    .results-grid {
        grid-template-columns: 1fr;
        gap: 15px;
        padding: 20px;
    }
    
    .result-item {
        flex-direction: column;
    }
    
    .result-image {
        width: 100%;
        height: 150px;
    }
}
`

// Agregar estilos
const styleSheet = document.createElement("style")
styleSheet.textContent = searchStyles
document.head.appendChild(styleSheet)

// Inicializar sistema de búsqueda
let searchSystem
document.addEventListener("DOMContentLoaded", () => {
  searchSystem = new SearchSystem()
  window.searchSystem = searchSystem
})
