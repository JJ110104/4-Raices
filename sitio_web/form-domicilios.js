
document.addEventListener("DOMContentLoaded", function () {
    const orderDetailsTextarea = document.getElementById("orderDetails");
    const cartPreviewContainer = document.createElement("div");
    cartPreviewContainer.id = "cartPreview";
    cartPreviewContainer.style.border = "1px solid #ccc";
    cartPreviewContainer.style.padding = "10px";
    cartPreviewContainer.style.marginTop = "10px";
    cartPreviewContainer.style.background = "#f9f9f9";

    // Botón para limpiar carrito
    const clearCartBtn= document.createElement("button");
    clearCartBtn.textContent = "🧹 Limpiar Pedido";
    clearCartBtn.classList.add("clearCartBtn");


    // Insertar preview y botón antes del textarea
    orderDetailsTextarea.parentNode.insertBefore(cartPreviewContainer, orderDetailsTextarea);
    orderDetailsTextarea.parentNode.insertBefore(clearCartBtn, orderDetailsTextarea);

    function showCartPreview() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            cartPreviewContainer.innerHTML = "<strong>Tu carrito está vacío.</strong>";
            clearCartBtn.style.display = "none";
            return;
        }

        let previewHtml = "<strong>📋 Previsualización del Pedido:</strong><ul>";
        let orderDetailsText = "";

        cart.forEach(item => {
            const total = item.price * item.quantity;
            previewHtml += `<li>${item.name} x${item.quantity} - $${total.toLocaleString()}</li>`;
            orderDetailsText += `${item.name} x${item.quantity} - $${total}\n`;
        });

        previewHtml += "</ul>";
        cartPreviewContainer.innerHTML = previewHtml;
        clearCartBtn.style.display = "inline-block";

        // Solo auto-llenar si el usuario aún no ha escrito nada
        if (orderDetailsTextarea && orderDetailsTextarea.value.trim() === "") {
            orderDetailsTextarea.value = orderDetailsText;
        }
    }

    // Acción del botón limpiar
    clearCartBtn.addEventListener("click", function () {
        if (confirm("¿Seguro que quieres vaciar tu pedido?")) {
            localStorage.removeItem("cart");
            cartPreviewContainer.innerHTML = "<strong>Tu carrito ha sido vaciado.</strong>";
            orderDetailsTextarea.value = "";
            clearCartBtn.style.display = "none";
        }
    });

    showCartPreview();
});