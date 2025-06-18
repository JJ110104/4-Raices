// ===== SISTEMA DE CARRITO DE COMPRAS =====
// Funcionalidad: Gestión completa del carrito con persistencia

class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || []
    this.sidebar = document.getElementById("cartSidebar")
    this.itemsContainer = document.getElementById("cartItems")
    this.totalElement = document.getElementById("cartTotal")
    this.countElement = document.getElementById("cartCount")
    this.floatBtn = document.getElementById("cartFloatBtn")
    this.closeBtn = document.getElementById("closeCart")

    this.init()
  }

  init() {
    this.setupEvents()
    this.updateDisplay()
    this.setupAddToCartButtons()
  }

  setupEvents() {
    // Abrir/cerrar carrito
    this.floatBtn.addEventListener("click", () => this.toggleCart())
    this.closeBtn.addEventListener("click", () => this.closeCart())

    // Cerrar carrito clickeando fuera
    document.addEventListener("click", (e) => {
      if (!this.sidebar.contains(e.target) && !this.floatBtn.contains(e.target)) {
        this.closeCart()
      }
    })

    // Checkout
    const checkoutBtn = document.querySelector(".checkout-btn")
    checkoutBtn.addEventListener("click", () => this.checkout())
  }

  setupAddToCartButtons() {
    const addButtons = document.querySelectorAll(".add-to-cart")
    addButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const product = e.target.dataset.product
        const price = Number.parseInt(e.target.dataset.price)
        const name = e.target.closest(".tarjeta").querySelector("h5").textContent
        const image = e.target.closest(".tarjeta").querySelector("img").src

        this.addItem({
          id: product,
          name: name,
          price: price,
          image: image,
          quantity: 1,
        })

        this.showAddedAnimation(e.target)
      })
    })
  }

  addItem(item) {
    const existingItem = this.items.find((i) => i.id === item.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push(item)
    }

    this.saveCart()
    this.updateDisplay()
    this.playAddSound()

    // Mostrar notificación
    this.showNotification(`${item.name} agregado al carrito`, "success")
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId)
    this.saveCart()
    this.updateDisplay()
    this.playRemoveSound()
  }

  updateQuantity(itemId, newQuantity) {
    const item = this.items.find((i) => i.id === itemId)
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(itemId)
      } else {
        item.quantity = newQuantity
        this.saveCart()
        this.updateDisplay()
      }
    }
  }

  updateDisplay() {
    this.renderItems()
    this.updateTotal()
    this.updateCount()
  }

  renderItems() {
    this.itemsContainer.innerHTML = ""

    if (this.items.length === 0) {
      this.itemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Tu carrito está vacío</p>
                    <p>¡Agrega algunos productos deliciosos!</p>
                </div>
            `
      return
    }

    this.items.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = "cart-item"
      itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="cart.removeItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `
      this.itemsContainer.appendChild(itemElement)
    })
  }

  updateTotal() {
    const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    this.totalElement.textContent = total.toLocaleString()
  }

  updateCount() {
    const count = this.items.reduce((sum, item) => sum + item.quantity, 0)
    this.countElement.textContent = count

    // Animación del contador
    if (count > 0) {
      this.countElement.style.transform = "scale(1.2)"
      setTimeout(() => {
        this.countElement.style.transform = "scale(1)"
      }, 200)
    }
  }

  toggleCart() {
    this.sidebar.classList.toggle("open")
    if (this.sidebar.classList.contains("open")) {
      this.playOpenSound()
    }
  }

  closeCart() {
    this.sidebar.classList.remove("open")
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items))
  }

  checkout() {
    if (this.items.length === 0) {
      this.showNotification("Tu carrito está vacío", "error")
      return
    }

    // Simular proceso de checkout
    this.showNotification("Procesando tu pedido...", "info")

    setTimeout(() => {
      this.showNotification("¡Pedido realizado con éxito!", "success")
      this.items = []
      this.saveCart()
      this.updateDisplay()
      this.closeCart()
    }, 2000)

    this.playCheckoutSound()
  }

  showAddedAnimation(button) {
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

  showNotification(message, type) {
    // Usar el sistema de notificaciones global
    if (window.showNotification) {
      window.showNotification(message, type)
    }
  }

  // Sonidos del carrito
  playAddSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/add-to-cart.mp3")
      audio.volume = 0.3
      audio.play().catch(() => {})
    }
  }

  playRemoveSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/remove-item.mp3")
      audio.volume = 0.2
      audio.play().catch(() => {})
    }
  }

  playOpenSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/cart-open.mp3")
      audio.volume = 0.2
      audio.play().catch(() => {})
    }
  }

  playCheckoutSound() {
    if (window.soundsEnabled) {
      const audio = new Audio("/sounds/checkout.mp3")
      audio.volume = 0.4
      audio.play().catch(() => {})
    }
  }
}

// CSS adicional para carrito vacío
const cartStyles = `
.empty-cart {
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
}

.empty-cart p {
    margin: 10px 0;
}

.empty-cart p:first-child {
    font-size: 1.2rem;
    font-weight: bold;
}
`

// Agregar estilos
const styleSheet = document.createElement("style")
styleSheet.textContent = cartStyles
document.head.appendChild(styleSheet)

// Inicializar carrito
let cart
document.addEventListener("DOMContentLoaded", () => {
  cart = new ShoppingCart()
  window.cart = cart // Hacer disponible globalmente
})
