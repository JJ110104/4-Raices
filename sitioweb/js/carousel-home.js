// ===== CARRUSEL PARA PÁGINA DE INICIO =====
class HomeCarousel {
  constructor() {
    this.currentSlide = 0
    this.slides = []
    this.autoPlayInterval = null
    this.autoPlayDelay = 5000
    this.init()
  }

  init() {
    this.createCarousel()
    this.setupEvents()
    this.startAutoPlay()
  }

  createCarousel() {
    const carouselSection = document.createElement("section")
    carouselSection.className = "home-carousel-section"

    carouselSection.innerHTML = `
      <div class="home-carousel-container">
        <div class="carousel-slide active">
          <img src="../src/img/cafe-ambiente-1.jpg" alt="Ambiente acogedor" onerror="this.src='../src/img/BANNER-COFFEE.jpeg'">
          <div class="carousel-caption">
            <h3>Ambiente Acogedor</h3>
            <p>Disfruta de nuestro espacio diseñado para tu comodidad y relajación</p>
          </div>
        </div>
        
        <div class="carousel-slide">
          <img src="../src/img/cafe-especialidad.jpg" alt="Café de especialidad" onerror="this.src='../src/img/taza-cafe-index.jpeg'">
          <div class="carousel-caption">
            <h3>Café de Especialidad</h3>
            <p>Granos seleccionados y tostados artesanalmente para una experiencia única</p>
          </div>
        </div>
        
        <div class="carousel-slide">
          <img src="../src/img/postres-artesanales.jpg" alt="Postres artesanales" onerror="this.src='../src/img/cheesecake-frutos.jpg'">
          <div class="carousel-caption">
            <h3>Postres Artesanales</h3>
            <p>Dulces creaciones hechas con amor y los mejores ingredientes</p>
          </div>
        </div>
        
        <div class="carousel-slide">
          <img src="../src/img/panaderia-fresca.jpg" alt="Panadería fresca" onerror="this.src='../src/img/pan.jpg'">
          <div class="carousel-caption">
            <h3>Panadería Fresca</h3>
            <p>Pan horneado diariamente con técnicas tradicionales</p>
          </div>
        </div>

        <button class="carousel-nav carousel-prev">‹</button>
        <button class="carousel-nav carousel-next">›</button>
        
        <div class="carousel-indicators">
          <div class="carousel-indicator active" data-slide="0"></div>
          <div class="carousel-indicator" data-slide="1"></div>
          <div class="carousel-indicator" data-slide="2"></div>
          <div class="carousel-indicator" data-slide="3"></div>
        </div>
      </div>
    `

    // Insertar después de la navegación
    const navigation = document.querySelector(".navegacion")
    if (navigation) {
      navigation.parentNode.insertBefore(carouselSection, navigation.nextSibling)
    }

    this.container = document.querySelector(".home-carousel-container")
    this.slides = document.querySelectorAll(".carousel-slide")
    this.indicators = document.querySelectorAll(".carousel-indicator")
  }

  setupEvents() {
    // Navegación
    const prevBtn = document.querySelector(".carousel-prev")
    const nextBtn = document.querySelector(".carousel-next")

    if (prevBtn) prevBtn.addEventListener("click", () => this.prevSlide())
    if (nextBtn) nextBtn.addEventListener("click", () => this.nextSlide())

    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index))
    })

    // Pausar autoplay en hover
    if (this.container) {
      this.container.addEventListener("mouseenter", () => this.stopAutoPlay())
      this.container.addEventListener("mouseleave", () => this.startAutoPlay())
    }

    // Touch/swipe para móviles
    this.setupTouchEvents()
  }

  setupTouchEvents() {
    if (!this.container) return

    let startX = 0
    let endX = 0

    this.container.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    this.container.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      this.handleSwipe()
    })

    const handleSwipe = () => {
      const diffX = startX - endX
      const threshold = 50

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          this.nextSlide()
        } else {
          this.prevSlide()
        }
      }
    }

    this.handleSwipe = handleSwipe
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length
    this.updateSlide()
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length
    this.updateSlide()
  }

  goToSlide(index) {
    this.currentSlide = index
    this.updateSlide()
  }

  updateSlide() {
    // Actualizar slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlide)
    })

    // Actualizar indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide)
    })
  }

  startAutoPlay() {
    this.stopAutoPlay()
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide()
    }, this.autoPlayDelay)
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
    }
  }
}

// Inicializar carrusel solo en la página de inicio
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si estamos en la página de inicio
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/")

  if (isHomePage) {
    new HomeCarousel()
  }
})
