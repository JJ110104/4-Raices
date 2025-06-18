// ===== CAROUSEL DE IMÁGENES =====
// Funcionalidad: Slider automático y manual de imágenes principales

class Carousel {
  constructor(container) {
    this.container = container
    this.slides = container.querySelectorAll(".carousel-slide")
    this.indicators = container.querySelectorAll(".indicator")
    this.prevBtn = container.querySelector(".carousel-prev")
    this.nextBtn = container.querySelector(".carousel-next")
    this.currentSlide = 0
    this.autoPlayInterval = null

    this.init()
  }

  init() {
    // Eventos de navegación
    this.prevBtn.addEventListener("click", () => this.prevSlide())
    this.nextBtn.addEventListener("click", () => this.nextSlide())

    // Eventos de indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index))
    })

    // Auto-play
    this.startAutoPlay()

    // Pausar auto-play en hover
    this.container.addEventListener("mouseenter", () => this.stopAutoPlay())
    this.container.addEventListener("mouseleave", () => this.startAutoPlay())

    // Soporte para touch/swipe en móviles
    this.setupTouchEvents()
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length
    this.updateSlide()
    this.playSlideSound()
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length
    this.updateSlide()
    this.playSlideSound()
  }

  goToSlide(index) {
    this.currentSlide = index
    this.updateSlide()
    this.playSlideSound()
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
    }, 5000) // Cambia cada 5 segundos
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
  }

  setupTouchEvents() {
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

  playSlideSound() {
    // Sonido sutil al cambiar slide
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/slide.mp3")
      audio.volume = 0.1
      audio.play().catch(() => {}) // Ignorar errores de autoplay
    }
  }
}

// Inicializar carousel cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const carouselContainer = document.querySelector(".carousel-container")
  if (carouselContainer) {
    new Carousel(carouselContainer)
  }
})
