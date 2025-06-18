// ===== SISTEMA DE CARRITO CORREGIDO =====
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || []
    this.isInitialized = false
    this.init()
  }

  init() {
    // Crear elementos del carrito si no existen
    this.createCartElements()

    // Obtener referencias a elementos
    this.sidebar = document.getElementById("cartSidebar")
    this.itemsContainer = document.getElementById("cartItems")
    this.totalElement = document.getElementById("cartTotal")
    this.countElement = document.getElementById("cartCount")
    this.floatBtn = document.getElementById("cartFloatBtn")
    this.closeBtn = document.getElementById("closeCart")

    if (this.sidebar && this.floatBtn) {
      this.setupEvents()
      this.updateDisplay()
      this.setupAddToCartButtons()
      this.isInitialized = true
      console.log("✅ Carrito inicializado correctamente")
    } else {
      console.error("❌ Error: No se pudieron encontrar los elementos del carrito")
    }
  }

  createCartElements() {
    // Verificar si ya existen los elementos
    if (document.getElementById("cartSidebar")) {
      return
    }

    // Crear sidebar del carrito
    const cartSidebar = document.createElement("div")
    cartSidebar.id = "cartSidebar"
    cartSidebar.className = "cart-sidebar"
    cartSidebar.innerHTML = `
      <div class="cart-header">
        <h3>🛒 Tu Carrito</h3>
        <button class="close-cart" id="closeCart">×</button>
      </div>
      <div class="cart-items" id="cartItems">
        <!-- Items del carrito se cargan aquí -->
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <strong>Total: $<span id="cartTotal">0</span></strong>
        </div>
        <button class="checkout-btn">Finalizar Compra</button>
      </div>
    `

    // Crear botón flotante
    const floatBtn = document.createElement("button")
    floatBtn.id = "cartFloatBtn"
    floatBtn.className = "cart-float-btn"
    floatBtn.innerHTML = `🛒 <span class="cart-count" id="cartCount">0</span>`

    // Agregar al DOM
    document.body.appendChild(cartSidebar)
    document.body.appendChild(floatBtn)
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
    const checkoutBtn = this.sidebar.querySelector(".checkout-btn")
    checkoutBtn.addEventListener("click", () => this.checkout())
  }

  setupAddToCartButtons() {
    // Buscar botones existentes y nuevos
    const addButtons = document.querySelectorAll(".add-to-cart")

    addButtons.forEach((button) => {
      // Remover listeners anteriores para evitar duplicados
      button.replaceWith(button.cloneNode(true))
    })

    // Agregar nuevos listeners
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()

        const productData = this.extractProductData(button)
        if (productData) {
          this.addItem(productData)
          this.showAddedAnimation(button)
        }
      })
    })
  }

  extractProductData(button) {
    try {
      // Método 1: Desde data attributes del botón
      if (button.dataset.product) {
        return {
          id: button.dataset.product,
          name: button.dataset.name || "Producto",
          price: Number.parseInt(button.dataset.price) || 0,
          image: button.dataset.image || "/placeholder.svg?height=100&width=100",
          quantity: 1,
        }
      }

      // Método 2: Desde la tarjeta padre
      const tarjeta = button.closest(".tarjeta")
      if (tarjeta) {
        const name = tarjeta.querySelector("h5")?.textContent || "Producto"
        const image = tarjeta.querySelector("img")?.src || "/placeholder.svg?height=100&width=100"
        const priceText = button.textContent.match(/\$[\d,]+/)
        const price = priceText ? Number.parseInt(priceText[0].replace(/[$,]/g, "")) : 0

        return {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name: name,
          price: price,
          image: image,
          quantity: 1,
        }
      }

      // Método 3: Desde producto de menú
      const producto = button.closest(".producto")
      if (producto) {
        const name = producto.querySelector(".nombre")?.textContent || "Producto"
        const image = producto.querySelector("img")?.src || "/placeholder.svg?height=100&width=100"
        const priceText = button.textContent.match(/\$[\d,]+/)
        const price = priceText ? Number.parseInt(priceText[0].replace(/[$,]/g, "")) : 0

        return {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name: name,
          price: price,
          image: image,
          quantity: 1,
        }
      }

      console.error("No se pudo extraer información del producto")
      return null
    } catch (error) {
      console.error("Error extrayendo datos del producto:", error)
      return null
    }
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
    this.showNotification(`${item.name} agregado al carrito`, "success")
    console.log("✅ Producto agregado:", item)
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId)
    this.saveCart()
    this.updateDisplay()
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
    if (!this.itemsContainer) return

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
        <img src="${item.image}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=60&width=60'">
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
    if (!this.totalElement) return

    const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    this.totalElement.textContent = total.toLocaleString()
  }

  updateCount() {
    if (!this.countElement) return

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
    if (!this.sidebar) return

    this.sidebar.classList.toggle("open")
    if (this.sidebar.classList.contains("open")) {
      console.log("🛒 Carrito abierto")
    }
  }

  closeCart() {
    if (!this.sidebar) return

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

    this.showNotification("Procesando tu pedido...", "info")

    setTimeout(() => {
      this.showNotification("¡Pedido realizado con éxito!", "success")
      this.items = []
      this.saveCart()
      this.updateDisplay()
      this.closeCart()
    }, 2000)
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
    // Crear notificación
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Estilos
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
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 4000)
  }
}

// Inicializar carrito cuando el DOM esté listo
let cart
document.addEventListener("DOMContentLoaded", () => {
  cart = new ShoppingCart()
  window.cart = cart // Hacer disponible globalmente

  // Reinicializar cuando se agreguen nuevos productos dinámicamente
  const observer = new MutationObserver(() => {
    if (cart && cart.isInitialized) {
      cart.setupAddToCartButtons()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})
