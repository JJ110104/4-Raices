// ===== GALERÍA INTERACTIVA =====
// Funcionalidad: Modal de galería con navegación y efectos

class Gallery {
  constructor() {
    this.images = []
    this.currentIndex = 0
    this.modal = null
    this.modalImage = null

    this.init()
  }

  init() {
    this.createModal()
    this.setupGalleryItems()
    this.setupModalEvents()
  }

  createModal() {
    // El modal ya existe en el HTML, solo necesitamos referencias
    this.modal = document.getElementById("galleryModal")
    this.modalImage = document.getElementById("modalImage")
    this.closeBtn = this.modal.querySelector(".close-modal")
    this.prevBtn = this.modal.querySelector(".modal-prev")
    this.nextBtn = this.modal.querySelector(".modal-next")
  }

  setupGalleryItems() {
    const galleryItems = document.querySelectorAll(".gallery-item")

    galleryItems.forEach((item, index) => {
      const img = item.querySelector("img")
      const largeImageSrc = item.dataset.image

      this.images.push({
        src: largeImageSrc,
        alt: img.alt,
        thumbnail: img.src,
      })

      item.addEventListener("click", () => {
        this.openModal(index)
      })

      // Efecto hover mejorado
      item.addEventListener("mouseenter", () => {
        this.playHoverSound()
      })
    })
  }

  setupModalEvents() {
    // Cerrar modal
    this.closeBtn.addEventListener("click", () => this.closeModal())

    // Navegación
    this.prevBtn.addEventListener("click", () => this.showPrevious())
    this.nextBtn.addEventListener("click", () => this.showNext())

    // Cerrar con ESC o click fuera
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal()
    })

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal()
    })

    // Navegación con teclado
    document.addEventListener("keydown", (e) => {
      if (this.modal.style.display === "block") {
        if (e.key === "ArrowLeft") this.showPrevious()
        if (e.key === "ArrowRight") this.showNext()
      }
    })
  }

  openModal(index) {
    this.currentIndex = index
    this.showImage()
    this.modal.style.display = "block"
    document.body.style.overflow = "hidden" // Prevenir scroll

    // Efecto de zoom suave
    this.modalImage.style.transform = "scale(0.8)"
    this.modalImage.style.opacity = "0"

    setTimeout(() => {
      this.modalImage.style.transition = "all 0.3s ease"
      this.modalImage.style.transform = "scale(1)"
      this.modalImage.style.opacity = "1"
    }, 50)

    this.playOpenSound()
  }

  closeModal() {
    this.modal.style.display = "none"
    document.body.style.overflow = "auto"
    this.playCloseSound()
  }

  showImage() {
    const image = this.images[this.currentIndex]
    this.modalImage.src = image.src
    this.modalImage.alt = image.alt

    // Precargar imagen siguiente
    if (this.images[this.currentIndex + 1]) {
      const nextImg = new Image()
      nextImg.src = this.images[this.currentIndex + 1].src
    }
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length
    this.showImage()
    this.playNavigationSound()
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    this.showImage()
    this.playNavigationSound()
  }

  // Sonidos para la galería
  playOpenSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/modal-open.mp3")
      audio.volume = 0.2
      audio.play().catch(() => {})
    }
  }

  playCloseSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/modal-close.mp3")
      audio.volume = 0.2
      audio.play().catch(() => {})
    }
  }

  playNavigationSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/gallery-nav.mp3")
      audio.volume = 0.1
      audio.play().catch(() => {})
    }
  }

  playHoverSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/hover.mp3")
      audio.volume = 0.05
      audio.play().catch(() => {})
    }
  }
}

// Inicializar galería
document.addEventListener("DOMContentLoaded", () => {
  new Gallery()
})
