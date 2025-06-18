// ===== JAVASCRIPT PRINCIPAL SIMPLIFICADO =====

// Variables globales
const cart = {
  items: JSON.parse(localStorage.getItem("cart")) || [],

  // Agregar producto
  addItem: function (product) {
    const existingItem = this.items.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({ ...product, quantity: 1 })
    }

    this.saveCart()
    this.updateDisplay()
    this.showNotification(`${product.name} agregado al carrito`, "success")
  },

  // Guardar carrito
  saveCart: function () {
    localStorage.setItem("cart", JSON.stringify(this.items))
  },

  // Actualizar display
  updateDisplay: function () {
    const count = this.items.reduce((sum, item) => sum + item.quantity, 0)
    const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    document.getElementById("cartCount").textContent = count
    document.getElementById("cartTotal").textContent = total.toLocaleString()

    this.renderItems()
  },

  // Renderizar items
  renderItems: function () {
    const container = document.getElementById("cartItems")
    if (!container) return

    if (this.items.length === 0) {
      container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Tu carrito está vacío</div>'
      return
    }

    container.innerHTML = this.items
      .map(
        (item) => `
      <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
        <div style="flex: 1;">
          <div style="font-weight: bold; color: #473428;">${item.name}</div>
          <div style="color: #6f4e37; font-weight: bold;">$${item.price.toLocaleString()}</div>
          <div style="margin-top: 5px;">
            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" style="background: #e7ba91; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
            <span style="margin: 0 10px; font-weight: bold;">${item.quantity}</span>
            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" style="background: #e7ba91; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
            <button onclick="cart.removeItem('${item.id}')" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Eliminar</button>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  },

  // Actualizar cantidad
  updateQuantity: function (itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(itemId)
      return
    }

    const item = this.items.find((i) => i.id === itemId)
    if (item) {
      item.quantity = newQuantity
      this.saveCart()
      this.updateDisplay()
    }
  },

  // Remover item
  removeItem: function (itemId) {
    this.items = this.items.filter((item) => item.id !== itemId)
    this.saveCart()
    this.updateDisplay()
  },

  // Mostrar notificación
  showNotification: (message, type) => {
    const notification = document.createElement("div")
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
    `

    if (type === "success") {
      notification.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)"
    } else {
      notification.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)"
    }

    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  },
}

// Chat simple
const chat = {
  isOpen: false,

  toggle: function () {
    const widget = document.getElementById("chatWidget")
    if (widget) {
      this.isOpen = !this.isOpen
      widget.classList.toggle("open", this.isOpen)
    }
  },

  sendMessage: () => {
    const input = document.getElementById("chatInput")
    const messages = document.getElementById("chatMessages")

    if (input && input.value.trim() && messages) {
      // Agregar mensaje del usuario
      const userMsg = document.createElement("div")
      userMsg.style.cssText = `
        background: linear-gradient(135deg, #e7ba91, #ca9676);
        color: #473428;
        padding: 12px 15px;
        border-radius: 18px;
        margin-bottom: 15px;
        max-width: 80%;
        margin-left: auto;
        border-bottom-right-radius: 5px;
      `
      userMsg.textContent = input.value
      messages.appendChild(userMsg)

      // Respuesta automática
      setTimeout(() => {
        const botMsg = document.createElement("div")
        botMsg.className = "bot-message"
        botMsg.textContent = "¡Gracias por tu mensaje! Te responderemos pronto. ☕"
        messages.appendChild(botMsg)
        messages.scrollTop = messages.scrollHeight
      }, 1000)

      input.value = ""
      messages.scrollTop = messages.scrollHeight
    }
  },
}

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌱 4 Raíces Coffee Shop cargando...")

  // Inicializar carrito
  cart.updateDisplay()

  // Event listeners para carrito
  const cartFloatBtn = document.getElementById("cartFloatBtn")
  const cartSidebar = document.getElementById("cartSidebar")
  const closeCart = document.getElementById("closeCart")

  if (cartFloatBtn) {
    cartFloatBtn.addEventListener("click", () => {
      if (cartSidebar) {
        cartSidebar.classList.toggle("open")
      }
    })
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      if (cartSidebar) {
        cartSidebar.classList.remove("open")
      }
    })
  }

  // Event listeners para chat
  const chatFloatBtn = document.getElementById("chatFloatBtn")
  const closeChat = document.getElementById("closeChat")
  const sendMessage = document.getElementById("sendMessage")
  const chatInput = document.getElementById("chatInput")

  if (chatFloatBtn) {
    chatFloatBtn.addEventListener("click", () => chat.toggle())
  }

  if (closeChat) {
    closeChat.addEventListener("click", () => chat.toggle())
  }

  if (sendMessage) {
    sendMessage.addEventListener("click", () => chat.sendMessage())
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        chat.sendMessage()
      }
    })
  }

  // Event listeners para botones agregar al carrito
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault()

      const button = e.target
      const product = {
        id: button.dataset.product || Math.random().toString(36).substr(2, 9),
        name: button.dataset.name || "Producto",
        price: Number.parseInt(button.dataset.price) || 0,
        image: button.dataset.image || "/placeholder.svg?height=100&width=100",
      }

      cart.addItem(product)

      // Animación del botón
      const originalText = button.textContent
      button.textContent = "¡Agregado! ✓"
      button.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)"
      button.style.color = "white"

      setTimeout(() => {
        button.textContent = originalText
        button.style.background = ""
        button.style.color = ""
      }, 1500)
    }
  })

  // Checkout
  const checkoutBtn = document.querySelector(".checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.items.length === 0) {
        cart.showNotification("Tu carrito está vacío", "error")
        return
      }

      cart.showNotification("¡Pedido realizado con éxito!", "success")
      cart.items = []
      cart.saveCart()
      cart.updateDisplay()

      const cartSidebar = document.getElementById("cartSidebar")
      if (cartSidebar) {
        cartSidebar.classList.remove("open")
      }
    })
  }

  // Formularios
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
          setTimeout(() => {
            input.style.borderColor = ""
          }, 3000)
        }
      })

      if (isValid) {
        cart.showNotification("¡Formulario enviado exitosamente!", "success")
        this.reset()
      } else {
        cart.showNotification("Por favor, completa todos los campos requeridos.", "error")
      }
    })
  })

  console.log("✅ 4 Raíces Coffee Shop cargado correctamente!")
})

// Hacer disponible globalmente
window.cart = cart
window.chat = chat
