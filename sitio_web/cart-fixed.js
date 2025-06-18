document.addEventListener('DOMContentLoaded', () => {
    const applyCouponBtn = document.getElementById('applyCoupon');
    const couponInput = document.getElementById('couponCode');
    const couponResult = document.getElementById('couponResult');
    const cartTotalEl = document.getElementById('cartTotal');

    const coupons = {
        'PRIMERA10': 0.10,
        'CAFE20': 0.20,
        'DULCE15': 0.15
    };

    let originalTotal = parseFloat(cartTotalEl.textContent) || 0;
    let discountApplied = 0;    

    function applyCoupon(code) {
        const discount = coupons[code];
        discountApplied = originalTotal * discount;
        const newTotal = originalTotal - discountApplied;

        cartTotalEl.textContent = newTotal.toFixed(2);
        couponResult.innerHTML = `<p style="color:green;">Cupón aplicado: -$${discountApplied.toFixed(2)}</p>`;
        couponInput.disabled = true;
        applyCouponBtn.disabled = true;

        localStorage.setItem('appliedCoupon', code);
    }

    applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();

        if (localStorage.getItem('appliedCoupon')) {
            couponResult.innerHTML = `<p style="color:red;">Ya aplicaste un cupón.</p>`;
            return;
        }

        if (coupons[code]) {
            applyCoupon(code);
        } else {
            couponResult.innerHTML = `<p style="color:red;">Cupón no válido.</p>`;
        }
    });

    // Si ya hay un cupón guardado en localStorage al cargar
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon && coupons[savedCoupon]) {
        setTimeout(() => {
            originalTotal = parseFloat(cartTotalEl.textContent) || 0;
            applyCoupon(savedCoupon);
        }, 500); // Espera para que se actualice el total inicial
    }

    // Recalcular originalTotal cada vez que cambie el DOM del total
    const observer = new MutationObserver(() => {
        if (!localStorage.getItem('appliedCoupon')) {
            originalTotal = parseFloat(cartTotalEl.textContent) || 0;
        }
    });

    observer.observe(cartTotalEl, { childList: true });
});