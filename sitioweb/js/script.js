// ===== JAVASCRIPT PARA MEJORAR LA INTERACTIVIDAD =====

document.addEventListener("DOMContentLoaded", () => {
  // ===== ANIMACIONES DE SCROLL =====
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

  // Observar elementos para animaciones de scroll
  const elementsToAnimate = document.querySelectorAll(".tarjeta, .producto, .seccion")
  elementsToAnimate.forEach((el) => {
    el.classList.add("scroll-fade")
    observer.observe(el)
  })

  // ===== NAVEGACIÓN SUAVE =====
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

  // ===== EFECTOS HOVER MEJORADOS =====
  const tarjetas = document.querySelectorAll(".tarjeta")
  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.03)"
      this.style.boxShadow = "0 30px 80px rgba(0, 0, 0, 0.4)"
    })

    tarjeta.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
      this.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.2)"
    })
  })

  // ===== VALIDACIÓN DE FORMULARIOS =====
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()

      // Validación básica
      const inputs = this.querySelectorAll("input[required], select[required], textarea[required]")
      let isValid = true

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
          input.style.borderColor = "#e74c3c"
          input.style.boxShadow = "0 0 10px rgba(231, 76, 60, 0.5)"

          // Remover el error después de 3 segundos
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
        // Simular envío exitoso
        showNotification("¡Formulario enviado exitosamente!", "success")
        this.reset()
      } else {
        showNotification("Por favor, completa todos los campos requeridos.", "error")
      }
    })
  })

  // ===== SISTEMA DE NOTIFICACIONES =====
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    // Estilos de la notificación
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `

    // Colores según el tipo
    switch (type) {
      case "success":
        notification.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)"
        break
      case "error":
        notification.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)"
        break
      default:
        notification.style.background = "linear-gradient(135deg, #3498db, #2980b9)"
    }

    document.body.appendChild(notification)

    // Animar entrada
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remover después de 4 segundos
    setTimeout(() => {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 4000)
  }

  // ===== EFECTOS DE PARALAJE SUAVE =====
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".div")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      element.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // ===== CONTADOR ANIMADO PARA NÚMEROS =====
  function animateNumbers() {
    const numbers = document.querySelectorAll(".animate-number")
    numbers.forEach((number) => {
      const target = Number.parseInt(number.textContent)
      let current = 0
      const increment = target / 100

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        number.textContent = Math.floor(current)
      }, 20)
    })
  }

  // ===== EFECTO TYPEWRITER PARA TEXTOS =====
  function typeWriter(element, text, speed = 50) {
    let i = 0
    element.textContent = ""

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        setTimeout(type, speed)
      }
    }
    type()
  }

  // ===== LAZY LOADING PARA IMÁGENES =====
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))

  // ===== MODO OSCURO/CLARO (OPCIONAL) =====
  function createThemeToggle() {
    const toggle = document.createElement("button")
    toggle.innerHTML = "🌙"
    toggle.className = "theme-toggle"
    toggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #6f4e37, #5c4033);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `

    toggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode")
      this.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙"
    })

    document.body.appendChild(toggle)
  }

  // Crear el botón de tema
  createThemeToggle()

  // ===== EFECTOS DE PARTÍCULAS (OPCIONAL) =====
  function createParticles() {
    const canvas = document.createElement("canvas")
    canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#6f4e37"

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })
  }

  // Crear partículas de fondo
  createParticles()

  // ===== INICIALIZACIÓN FINAL =====
  console.log("🌱 4 Raíces Coffee Shop - Sitio web mejorado cargado exitosamente! ☕")

  // Agregar clase de carga completada
  document.body.classList.add("loaded")

  // Animar números si existen
  setTimeout(animateNumbers, 1000)
})

// ===== UTILIDADES ADICIONALES =====

// Función para smooth scroll a cualquier elemento
function scrollToElement(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Función para detectar si un elemento está visible
function isElementVisible(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Función para formatear números con separadores de miles
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para validar teléfono colombiano
function isValidPhone(phone) {
  const phoneRegex = /^(\+57|57)?[1-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}
