// ===== UTILIDADES PARA PEDIDOS Y SERVICIOS =====
// Funcionalidad: Calculadora de domicilios, cupones y utilidades

class DeliveryCalculator {
  constructor() {
    this.addressInput = document.getElementById("deliveryAddress")
    this.calculateBtn = document.getElementById("calculateDelivery")
    this.resultDiv = document.getElementById("deliveryResult")

    this.zones = {
      centro: { cost: 3000, time: "20-30 min" },
      norte: { cost: 4000, time: "25-35 min" },
      sur: { cost: 4500, time: "30-40 min" },
      oriente: { cost: 5000, time: "35-45 min" },
      occidente: { cost: 5500, time: "40-50 min" },
      metropolitana: { cost: 6000, time: "45-60 min" },
    }

    this.init()
  }

  init() {
    if (this.calculateBtn) {
      this.calculateBtn.addEventListener("click", () => this.calculateDelivery())
    }
  }

  calculateDelivery() {
    const address = this.addressInput.value.trim().toLowerCase()

    if (!address) {
      this.showResult("Por favor ingresa una dirección", "error")
      return
    }

    // Simular cálculo basado en palabras clave
    let zone = "metropolitana" // Por defecto

    if (address.includes("centro") || address.includes("cabecera")) {
      zone = "centro"
    } else if (address.includes("norte") || address.includes("girón")) {
      zone = "norte"
    } else if (address.includes("sur") || address.includes("floridablanca")) {
      zone = "sur"
    } else if (address.includes("oriente") || address.includes("piedecuesta")) {
      zone = "oriente"
    } else if (address.includes("occidente")) {
      zone = "occidente"
    }

    const delivery = this.zones[zone]

    this.showResult(
      `
      <div class="delivery-success">
        <h4>✅ ¡Hacemos domicilio a tu zona!</h4>
        <p><strong>Costo de envío:</strong> $${delivery.cost.toLocaleString()}</p>
        <p><strong>Tiempo estimado:</strong> ${delivery.time}</p>
        <p class="delivery-note">💡 Envío gratis en pedidos superiores a $50.000</p>
      </div>
    `,
      "success",
    )
  }

  showResult(message, type) {
    this.resultDiv.innerHTML = message
    this.resultDiv.className = `delivery-result ${type}`
    this.resultDiv.style.display = "block"
  }
}

class CouponSystem {
  constructor() {
    this.couponInput = document.getElementById("couponCode")
    this.applyBtn = document.getElementById("applyCoupon")
    this.resultDiv = document.getElementById("couponResult")

    this.coupons = {
      PRIMERA10: { discount: 10, type: "percentage", description: "10% de descuento en tu primer pedido" },
      CAFE20: { discount: 20, type: "percentage", description: "20% de descuento en cafés especiales" },
      DULCE15: { discount: 15, type: "percentage", description: "15% de descuento en postres" },
      ENVIOGRATIS: { discount: 0, type: "shipping", description: "Envío gratuito" },
      DESCUENTO5000: { discount: 5000, type: "fixed", description: "$5.000 de descuento" },
    }

    this.init()
  }

  init() {
    if (this.applyBtn) {
      this.applyBtn.addEventListener("click", () => this.applyCoupon())
    }

    if (this.couponInput) {
      this.couponInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.applyCoupon()
      })
    }
  }

  applyCoupon() {
    const code = this.couponInput.value.trim().toUpperCase()

    if (!code) {
      this.showCouponResult("Por favor ingresa un código de cupón", "error")
      return
    }

    const coupon = this.coupons[code]

    if (coupon) {
      const message = `
        <div class="coupon-success">
          <h4>🎉 ¡Cupón aplicado exitosamente!</h4>
          <p><strong>Código:</strong> ${code}</p>
          <p><strong>Descuento:</strong> ${this.formatDiscount(coupon)}</p>
          <p>${coupon.description}</p>
        </div>
      `
      this.showCouponResult(message, "success")

      // Guardar cupón aplicado
      localStorage.setItem("appliedCoupon", JSON.stringify({ code, coupon }))
    } else {
      this.showCouponResult("❌ Código de cupón inválido o expirado", "error")
    }
  }

  formatDiscount(coupon) {
    switch (coupon.type) {
      case "percentage":
        return `${coupon.discount}%`
      case "fixed":
        return `$${coupon.discount.toLocaleString()}`
      case "shipping":
        return "Envío gratuito"
      default:
        return "Descuento especial"
    }
  }

  showCouponResult(message, type) {
    this.resultDiv.innerHTML = message
    this.resultDiv.className = `coupon-result ${type}`
    this.resultDiv.style.display = "block"
  }
}

class OrderForm {
  constructor() {
    this.form = document.getElementById("orderForm")
    this.init()
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    // Validar formulario
    if (!this.validateForm()) {
      return
    }

    // Simular envío de pedido
    this.submitOrder()
  }

  validateForm() {
    const requiredFields = this.form.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false
        field.style.borderColor = "#e74c3c"
        field.style.boxShadow = "0 0 10px rgba(231, 76, 60, 0.5)"

        setTimeout(() => {
          field.style.borderColor = ""
          field.style.boxShadow = ""
        }, 3000)
      }
    })

    if (!isValid) {
      window.showNotification("Por favor completa todos los campos requeridos", "error")
    }

    return isValid
  }

  submitOrder() {
    // Mostrar loading
    window.showNotification("Procesando tu pedido...", "info")

    // Simular envío
    setTimeout(() => {
      const orderNumber = Math.floor(Math.random() * 10000) + 1000

      window.showNotification(`¡Pedido #${orderNumber} recibido exitosamente! Te contactaremos pronto.`, "success")

      // Limpiar formulario
      this.form.reset()

      // Limpiar cupón aplicado
      localStorage.removeItem("appliedCoupon")
    }, 2000)
  }
}

// CSS adicional para utilidades
const utilitiesStyles = `
.delivery-calculator {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9));
  padding: 30px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  margin: 30px auto;
  max-width: 800px;
  backdrop-filter: blur(10px);
}

.delivery-calculator h3 {
  text-align: center;
  color: var(--color-brown-dark);
  margin-bottom: 20px;
}

.calculator-container {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.calculator-container input {
  flex: 1;
  min-width: 300px;
  padding: 12px 20px;
  border: 2px solid var(--color-accent);
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
}

.calculator-container button {
  background: linear-gradient(135deg, var(--color-primary), var(--color-brown-dark));
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: var(--transition-fast);
}

.calculator-container button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.delivery-result {
  margin-top: 20px;
  padding: 20px;
  border-radius: var(--border-radius-small);
  display: none;
}

.delivery-result.success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 2px solid #28a745;
  color: #155724;
}

.delivery-result.error {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border: 2px solid #dc3545;
  color: #721c24;
}

.delivery-success h4 {
  margin: 0 0 10px 0;
  color: #155724;
}

.delivery-success p {
  margin: 5px 0;
}

.delivery-note {
  font-style: italic;
  margin-top: 15px !important;
}

.coupon-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9));
  padding: 30px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  margin: 30px auto;
  max-width: 800px;
  backdrop-filter: blur(10px);
}

.coupon-section h3 {
  text-align: center;
  color: var(--color-brown-dark);
  margin-bottom: 20px;
}

.coupon-container {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 30px;
}

.coupon-container input {
  flex: 1;
  min-width: 250px;
  padding: 12px 20px;
  border: 2px solid var(--color-accent);
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  text-transform: uppercase;
}

.coupon-container button {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: var(--transition-fast);
}

.coupon-container button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.coupon-result {
  margin-top: 15px;
  padding: 15px;
  border-radius: var(--border-radius-small);
  display: none;
}

.coupon-result.success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 2px solid #28a745;
  color: #155724;
}

.coupon-result.error {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border: 2px solid #dc3545;
  color: #721c24;
  text-align: center;
}

.coupon-success h4 {
  margin: 0 0 10px 0;
}

.available-coupons {
  border-top: 2px dashed var(--color-accent);
  padding-top: 20px;
}

.available-coupons h4 {
  color: var(--color-brown-dark);
  margin-bottom: 15px;
}

.coupon-item {
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  padding: 10px 15px;
  border-radius: var(--border-radius-small);
  margin-bottom: 10px;
  color: var(--color-brown-dark);
  font-weight: bold;
}

.order-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

.order-link {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-brown-dark));
  color: white;
  padding: 15px 25px;
  border-radius: var(--border-radius-small);
  text-decoration: none;
  font-weight: bold;
  transition: var(--transition-fast);
}

.order-link:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
  color: white;
}

.delivery-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 249, 250, 0.8));
  border-radius: var(--border-radius-small);
  box-shadow: var(--shadow-soft);
}

.info-item i {
  font-size: 2rem;
  color: var(--color-primary);
  margin-top: 5px;
}

.info-item h4 {
  margin: 0 0 8px 0;
  color: var(--color-brown-dark);
}

.info-item p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 249, 250, 0.8));
  border-radius: var(--border-radius-small);
  box-shadow: var(--shadow-soft);
  transition: var(--transition-fast);
}

.contact-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
}

.contact-item i {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-top: 5px;
}

.contact-item h4 {
  margin: 0 0 10px 0;
  color: var(--color-brown-dark);
  font-size: 1.3rem;
}

.contact-item p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .calculator-container,
  .coupon-container {
    flex-direction: column;
  }
  
  .calculator-container input,
  .coupon-container input {
    min-width: auto;
  }
  
  .order-links {
    flex-direction: column;
    align-items: center;
  }
  
  .delivery-info,
  .contact-info {
    grid-template-columns: 1fr;
  }
}
`

// Agregar estilos
const styleSheet = document.createElement("style")
styleSheet.textContent = utilitiesStyles
document.head.appendChild(styleSheet)

// Inicializar utilidades
document.addEventListener("DOMContentLoaded", () => {
  new DeliveryCalculator()
  new CouponSystem()
  new OrderForm()
})

  // Script para manejar el formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
  this.reset();
});