// ===== SISTEMA DE PRECARGA =====
 // ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Inicializar componentes
  initPreloader()
  initCustomCursor()
  initCarousel()
  initCart()
  initChat()
  initFilters()
  initSearch()
  initReservations()
  initNewsletter()
  initContactForm()
  initDeliveryCalculator()
  initOrderForm()
  initFAQ()
  initDynamicContent()

  // Cargar productos destacados
  loadFeaturedProducts()

  // Actualizar contadores
  updateCartCount()
  updateCartDisplay()

  console.log("4 Raíces Coffee Shop - Aplicación inicializada")
}

  
// ===== PRELOADER =====
function initPreloader() {
  const preloader = document.getElementById("preloader")
  const loadingProgress = document.getElementById("loading-progress")
  const loadingPercentage = document.getElementById("loading-percentage")
  const skipButton = document.getElementById("skip-preloader")

  if (!preloader) return

  let progress = 0
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15
    if (progress >= 100) {
      progress = 100
      clearInterval(progressInterval)
      setTimeout(hidePreloader, 500)
    }

    if (loadingProgress) loadingProgress.style.width = progress + "%"
    if (loadingPercentage) loadingPercentage.textContent = Math.round(progress) + "%"
  }, 200)

  // Auto-hide después de 4 segundos máximo
  setTimeout(() => {
    clearInterval(progressInterval)
    hidePreloader()
  }, 4000)

  // Skip button
  if (skipButton) {
    skipButton.addEventListener("click", () => {
      clearInterval(progressInterval)
      hidePreloader()
    })
  }

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add("hidden")
      setTimeout(() => {
        preloader.style.display = "none"
      }, 500)
    }
  }
}