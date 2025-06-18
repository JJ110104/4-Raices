// ===== FUNCIONALIDADES COMUNES PARA TODAS LAS PÁGINAS =====
// Este archivo se incluye en todas las páginas para funcionalidad básica

// Variables globales
window.soundsEnabled = false // Por defecto desactivado

// ===== SISTEMA DE NOTIFICACIONES GLOBAL =====
window.showNotification = (message, type = "info") => {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  // Animar entrada
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Remover después de 4 segundos
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// ===== CURSOR PERSONALIZADO =====
class CustomCursor {
  constructor() {
    this.cursor = document.querySelector(".custom-cursor")
    if (!this.cursor) {
      this.createCursor()
    }
    this.init()
  }

  createCursor() {
    this.cursor = document.createElement("div")
    this.cursor.className = "custom-cursor"
    document.body.appendChild(this.cursor)
  }

  init() {
    document.addEventListener("mousemove", (e) => {
      this.cursor.style.left = e.clientX - 10 + "px"
      this.cursor.style.top = e.clientY - 10 + "px"
      this.cursor.classList.add("active")
    })

    document.addEventListener("mouseleave", () => {
      this.cursor.classList.remove("active")
    })

    // Efectos hover
    const hoverElements = document.querySelectorAll("a, button, .tarjeta, .producto")
    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        this.cursor.classList.add("hover")
      })

      element.addEventListener("mouseleave", () => {
        this.cursor.classList.remove("hover")
      })
    })
  }
}

// ===== NAVEGACIÓN SUAVE =====
function initSmoothNavigation() {
  const navLinks = document.querySelectorAll('.navegacion a[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// ===== ANIMACIONES DE SCROLL =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observar elementos para animaciones
  const elementsToAnimate = document.querySelectorAll(".tarjeta, .producto, .seccion")
  elementsToAnimate.forEach((el) => {
    el.classList.add("scroll-fade")
    observer.observe(el)
  })
}


// ===== VALIDACIÓN DE FORMULARIOS COMÚN =====
function initFormValidation() {
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()

      const inputs = this.querySelectorAll("input[required], select[required], textarea[required]")
      let isValid = true

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
          input.style.borderColor = "#e74c3c"
          input.style.boxShadow = "0 0 10px rgba(231, 76, 60, 0.5)"

          setTimeout(() => {
            input.style.borderColor = ""
            input.style.boxShadow = ""
          }, 3000)
        } else {
          input.style.borderColor = "#27ae60"
          input.style.boxShadow = "0 0 10px rgba(39, 174, 96, 0.5)"
        }
      })

      if (isValid) {
        window.showNotification("¡Formulario enviado exitosamente!", "success")
        this.reset()
      } else {
        window.showNotification("Por favor, completa todos los campos requeridos.", "error")
      }
    })
  })
}

// ===== EFECTOS DE PARALAJE SUAVE =====
function initParallaxEffects() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".div")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      element.style.transform = `translateY(${scrolled * speed}px)`
    })
  })
}

// ===== INICIALIZACIÓN COMÚN =====
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar funcionalidades comunes
  new CustomCursor()
  initSmoothNavigation()
  initScrollAnimations()
  createThemeToggle()
  initFormValidation()
  initParallaxEffects()

  // Marcar página activa en navegación
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".navegacion a")
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("activo")
    }
  })

  console.log("🌱 4 Raíces Coffee Shop - Funcionalidades comunes cargadas! ☕")
})

// ===== UTILIDADES GLOBALES =====
window.scrollToElement = (elementId) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

window.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

window.isValidPhone = (phone) => {
  const phoneRegex = /^(\+57|57)?[1-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

window.formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
