// ===== SISTEMA DE CHAT EN VIVO =====
// Funcionalidad: Chat bot inteligente con respuestas automáticas

class LiveChat {
  constructor() {
    this.widget = document.getElementById("chatWidget")
    this.messages = document.getElementById("chatMessages")
    this.input = document.getElementById("chatInput")
    this.sendBtn = document.getElementById("sendMessage")
    this.floatBtn = document.getElementById("chatFloatBtn")
    this.closeBtn = document.getElementById("closeChat")

    this.responses = this.loadResponses()
    this.isTyping = false

    this.init()
  }

  init() {
    this.setupEvents()
    this.addWelcomeMessage()
  }

  setupEvents() {
    // Abrir/cerrar chat
    this.floatBtn.addEventListener("click", () => this.toggleChat())
    this.closeBtn.addEventListener("click", () => this.closeChat())

    // Enviar mensaje
    this.sendBtn.addEventListener("click", () => this.sendMessage())
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage()
    })

    // Cerrar chat clickeando fuera
    document.addEventListener("click", (e) => {
      if (!this.widget.contains(e.target) && !this.floatBtn.contains(e.target)) {
        this.closeChat()
      }
    })
  }

  loadResponses() {
    return {
      greeting: [
        "¡Hola! ¿En qué puedo ayudarte hoy?",
        "¡Bienvenido a 4 Raíces! ¿Cómo te puedo asistir?",
        "¡Qué gusto saludarte! ¿Qué necesitas saber?",
      ],
      menu: [
        "Tenemos una gran variedad de cafés, postres y panes artesanales. ¿Te interesa algo en particular?",
        "Nuestro menú incluye cafés de especialidad, panadería fresca y postres caseros. ¿Qué te llama la atención?",
        "Ofrecemos desde espressos hasta lattes, más panes recién horneados y deliciosos postres. ¿Por dónde empezamos?",
      ],
      prices: [
        "Nuestros precios van desde $5.000 para panes hasta $15.000 para postres especiales. ¿Te interesa algo específico?",
        "Los cafés están entre $8.000 y $12.000, y nuestros postres desde $10.000. ¿Qué te gustaría saber?",
        "Los precios varían según el producto. ¿Te puedo ayudar con algún ítem en particular?",
      ],
      hours: [
        "Estamos abiertos de Lunes a Viernes de 7:00 AM a 9:00 PM, Sábados de 8:00 AM a 10:00 PM y Domingos de 9:00 AM a 8:00 PM.",
        "Nuestros horarios son: L-V: 7AM-9PM, Sábados: 8AM-10PM, Domingos: 9AM-8PM.",
        "Puedes visitarnos todos los días. Los horarios exactos están en nuestra página principal.",
      ],
      location: [
        "Nos encontramos en la Cra 29 #50-20, Barrio Sotomayor, Bucaramanga.",
        "Estamos ubicados en Sotomayor, Cra 29 #50-20. ¡Te esperamos!",
        "Nuestra sede principal está en el corazón de Bucaramanga, en Sotomayor.",
      ],
      delivery: [
        "¡Sí! Hacemos domicilios. Puedes hacer tu pedido en línea o llamarnos directamente.",
        "Tenemos servicio de domicilios disponible. ¿Te gustaría hacer un pedido?",
        "¡Por supuesto! Llevamos nuestros productos hasta tu casa. ¿Qué te gustaría pedir?",
      ],
      reservations: [
        "Puedes hacer tu reserva en nuestra página de reservas o llamándonos directamente.",
        "¡Excelente idea! Tenemos un sistema de reservas en línea muy fácil de usar.",
        "Para reservar mesa puedes usar nuestro sistema en línea o contactarnos.",
      ],
      default: [
        "Interesante pregunta. ¿Te puedo ayudar con información sobre nuestro menú, horarios o ubicación?",
        "No estoy segura de esa información específica, pero puedo ayudarte con nuestros productos, horarios o reservas.",
        "¿Podrías ser más específico? Puedo ayudarte con menú, precios, horarios, ubicación o reservas.",
      ],
    }
  }

  addWelcomeMessage() {
    const welcomeMsg = this.getRandomResponse("greeting")
    this.addBotMessage(welcomeMsg)
  }

  toggleChat() {
    this.widget.classList.toggle("open")
    if (this.widget.classList.contains("open")) {
      this.input.focus()
      this.playOpenSound()
    }
  }

  closeChat() {
    this.widget.classList.remove("open")
  }

  sendMessage() {
    const message = this.input.value.trim()
    if (!message) return

    this.addUserMessage(message)
    this.input.value = ""

    // Simular typing y responder
    setTimeout(() => {
      this.showTypingIndicator()
      this.playTypingSound()

      setTimeout(() => {
        this.hideTypingIndicator()
        const response = this.generateResponse(message)
        this.addBotMessage(response)
        this.playMessageSound()
      }, 1500)
    }, 500)
  }

  addUserMessage(message) {
    const msgDiv = document.createElement("div")
    msgDiv.className = "user-message"
    msgDiv.textContent = message
    this.messages.appendChild(msgDiv)
    this.scrollToBottom()
  }

  addBotMessage(message) {
    const msgDiv = document.createElement("div")
    msgDiv.className = "bot-message"
    msgDiv.textContent = message
    this.messages.appendChild(msgDiv)
    this.scrollToBottom()
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "typing-indicator"
    typingDiv.id = "typingIndicator"
    typingDiv.innerHTML = `
            <span>María está escribiendo</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `
    this.messages.appendChild(typingDiv)
    this.scrollToBottom()
    this.isTyping = true
  }

  hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator")
    if (indicator) {
      indicator.remove()
    }
    this.isTyping = false
  }

  generateResponse(message) {
    const msg = message.toLowerCase()

    // Palabras clave para diferentes respuestas
    if (msg.includes("hola") || msg.includes("hi") || msg.includes("hello")) {
      return this.getRandomResponse("greeting")
    }

    if (msg.includes("menu") || msg.includes("menú") || msg.includes("carta") || msg.includes("productos")) {
      return this.getRandomResponse("menu")
    }

    if (msg.includes("precio") || msg.includes("costo") || msg.includes("vale") || msg.includes("cuanto")) {
      return this.getRandomResponse("prices")
    }

    if (msg.includes("horario") || msg.includes("hora") || msg.includes("abierto") || msg.includes("cerrado")) {
      return this.getRandomResponse("hours")
    }

    if (
      msg.includes("ubicacion") ||
      msg.includes("ubicación") ||
      msg.includes("direccion") ||
      msg.includes("dirección") ||
      msg.includes("donde")
    ) {
      return this.getRandomResponse("location")
    }

    if (msg.includes("domicilio") || msg.includes("delivery") || msg.includes("envio") || msg.includes("envío")) {
      return this.getRandomResponse("delivery")
    }

    if (msg.includes("reserva") || msg.includes("mesa") || msg.includes("cita")) {
      return this.getRandomResponse("reservations")
    }

    if (msg.includes("cafe") || msg.includes("café")) {
      return "¡Nuestro café es nuestra especialidad! Tenemos desde espressos clásicos hasta lattes con sabores únicos. ¿Te gustaría saber más sobre alguno en particular?"
    }

    if (msg.includes("postre") || msg.includes("dulce") || msg.includes("torta")) {
      return "¡Los postres son nuestra pasión! Hacemos cheesecakes, tartas y brownies artesanales. ¿Cuál te llama más la atención?"
    }

    if (msg.includes("pan") || msg.includes("panaderia") || msg.includes("panadería")) {
      return "Nuestro pan se hornea fresco cada día. Tenemos desde baguettes hasta panes de masa madre. ¿Te interesa alguno en particular?"
    }

    return this.getRandomResponse("default")
  }

  getRandomResponse(category) {
    const responses = this.responses[category]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  scrollToBottom() {
    this.messages.scrollTop = this.messages.scrollHeight
  }

  // Sonidos del chat
  playOpenSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/chat-open.mp3")
      audio.volume = 0.2
      audio.play().catch(() => {})
    }
  }

  playMessageSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/chat-message.mp3")
      audio.volume = 0.3
      audio.play().catch(() => {})
    }
  }

  playTypingSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/chat-typing.mp3")
      audio.volume = 0.1
      audio.play().catch(() => {})
    }
  }
}

// Inicializar chat
document.addEventListener("DOMContentLoaded", () => {
  new LiveChat()
})
