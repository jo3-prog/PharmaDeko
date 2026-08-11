
// ==================== ROUTER ====================
const routes = {
    '': 'page-home',
    'admin': 'page-admin',
    'admin/products': 'page-admin-products',
    'admin/orders': 'page-admin-orders',
    'admin/reports': 'page-admin-reports',
    'admin/users': 'page-admin-users',
    'admin/purchase-orders': 'page-admin-purchase-orders',
    'admin/returns': 'page-admin-returns',
    'admin/production': 'page-admin-production',
    'my-orders': 'page-my-orders',
    'shop': 'page-shop',
    'cart': 'page-cart',
    'checkout/delivery': 'page-checkout-delivery',
    'checkout/review': 'page-checkout-review',
    'checkout/payment': 'page-checkout-payment',
    'order-success': 'page-order-success'
};

function navigateTo(path) {
    if (!path) path = '';
    window.location.hash = path;
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    const pageId = routes[hash] || 'page-home';

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    // Update nav active states
    document.querySelectorAll('.main-nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + hash || (hash === '' && a.getAttribute('href') === '#'));
    });

    // Update admin sidebar
    document.querySelectorAll('.admin-nav a').forEach(a => {
        const href = a.getAttribute('href')?.replace('#', '') || '';
        a.classList.toggle('active', href === hash);
    });
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);

// ==================== AUTH MODAL ====================
function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    showAuthScreen('welcome');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function showAuthScreen(screenId) {
    document.querySelectorAll('.auth-screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById('auth-' + screenId);
    if (target) target.classList.remove('hidden');

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show'));
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

function handleSignupStep1(e) {
    e.preventDefault();
    let valid = true;

    const firstname = document.getElementById('su-firstname').value.trim();
    const lastname = document.getElementById('su-lastname').value.trim();
    const email = document.getElementById('su-email').value.trim();
    const phone = document.getElementById('su-phone').value.trim();
    const password = document.getElementById('su-password').value;
    const confirm = document.getElementById('su-confirm').value;

    if (!firstname) { document.getElementById('err-firstname').classList.add('show'); valid = false; }
    else document.getElementById('err-firstname').classList.remove('show');

    if (!lastname) { document.getElementById('err-lastname').classList.add('show'); valid = false; }
    else document.getElementById('err-lastname').classList.remove('show');

    if (!email || !email.includes('@')) { document.getElementById('err-email').classList.add('show'); valid = false; }
    else document.getElementById('err-email').classList.remove('show');

    if (!phone) { document.getElementById('err-phone').classList.add('show'); valid = false; }
    else document.getElementById('err-phone').classList.remove('show');

    if (!password || password.length < 8) { document.getElementById('err-password').classList.add('show'); valid = false; }
    else document.getElementById('err-password').classList.remove('show');

    if (valid) showAuthScreen('signup-step2');
    return false;
}

function handleOtpVerify() {
    const digits = document.querySelectorAll('.otp-digit');
    const code = Array.from(digits).map(d => d.value).join('');

    if (code === '123456') {
        showAuthScreen('signup-step3');
    } else {
        document.getElementById('err-otp').classList.add('show');
    }
}

function moveOtp(el, index) {
    if (el.value.length === 1) {
        const next = document.querySelectorAll('.otp-digit')[index + 1];
        if (next) next.focus();
    }
}

function handleSignupStep3(e) {
    e.preventDefault();
    showAuthScreen('signup-success');
    return false;
}

function handleSignin(e) {
    e.preventDefault();
    const email = document.getElementById('si-email').value.trim();
    const password = document.getElementById('si-password').value;

    if (!email || !password) {
        document.getElementById('err-si-email').classList.add('show');
        return false;
    }

    document.getElementById('err-si-email').classList.remove('show');
    closeAuthModal();
    navigateTo('my-orders');
    return false;
}

// Account type selection
document.querySelectorAll('.acct-type').forEach(label => {
    label.addEventListener('click', function() {
        document.querySelectorAll('.acct-type').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        this.querySelector('input').checked = true;
    });
});

// Verify option selection
document.querySelectorAll('.verify-option').forEach(label => {
    label.addEventListener('click', function() {
        document.querySelectorAll('.verify-option').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        this.querySelector('input').checked = true;
    });
});

// ==================== FAQ ====================
function toggleFaq(el) {
    const item = el.parentElement;
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question i').className = 'fas fa-plus';
    });

    if (!isActive) {
        item.classList.add('active');
        el.querySelector('i').className = 'fas fa-times';
    }
}

// ==================== SCROLL ====================
function scrollToSection(id) {
    navigateTo('');
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// ==================== CART ====================
let cart = [
    { name: 'Parkalin Pediatrics Syrup', type: 'Syrup', size: '100ml', nafdac: 'A7-0421L', price: 1850, qty: 1, prescription: false },
    { name: 'Parkalin Chesty Syrup', type: 'Syrup', size: '100ml', nafdac: 'A7-0422L', price: 2100, qty: 1, prescription: false },
    { name: 'Parkalin with Codeine', type: 'Syrup', size: '100ml', nafdac: 'A7-0423L', price: 3200, qty: 1, prescription: true }
];

function addToCart(name, price) {
    cart.push({ name, type: 'Tablet', size: '500mg', nafdac: 'A4-1234', price, qty: 1, prescription: false });
    updateCartUI();
    navigateTo('cart');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateQty(index, delta) {
    cart[index].qty = Math.max(1, cart[index].qty + delta);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    let html = '';
    let subtotal = 0;
    let hasPrescription = false;

    cart.forEach((item, i) => {
        subtotal += item.price * item.qty;
        if (item.prescription) hasPrescription = true;

        html += `
        <div class="cart-item">
            <div class="cart-item-img placeholder-blue"></div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="tag tag-yellow">${item.type}</span> <span class="nafdac">${item.size} · NAFDAC: ${item.nafdac}</span>
                ${item.prescription ? '<p class="prescription"><i class="fas fa-exclamation-triangle"></i> Prescription required — upload below</p>' : ''}
                <div class="qty-control" style="margin-top:8px;">
                    <button onclick="updateQty(${i}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty(${i}, 1)">+</button>
                </div>
            </div>
            <div style="text-align:right;">
                <div class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${i})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    const delivery = 2500;
    const vat = Math.round(subtotal * 0.075);
    const total = subtotal + delivery + vat;

    document.getElementById('cart-subtotal').textContent = '₦' + subtotal.toLocaleString();
    document.getElementById('cart-vat').textContent = '₦' + vat.toLocaleString();
    document.getElementById('cart-total').textContent = '₦' + total.toLocaleString();

    const prescriptionSection = document.getElementById('prescription-section');
    if (prescriptionSection) prescriptionSection.style.display = hasPrescription ? 'block' : 'none';

    // Update checkout summary
    const checkoutSummary = document.getElementById('checkout-summary');
    if (checkoutSummary) {
        let summaryHtml = '';
        cart.forEach(item => {
            summaryHtml += `<div class="summary-row"><span>${item.name} × ${item.qty}</span><span>₦${(item.price * item.qty).toLocaleString()}</span></div>`;
        });
        summaryHtml += `<div class="summary-row"><span>Subtotal</span><span>₦${subtotal.toLocaleString()}</span></div>`;
        summaryHtml += `<div class="summary-row"><span>Delivery</span><span>₦${delivery.toLocaleString()}</span></div>`;
        summaryHtml += `<div class="summary-row"><span>VAT (7.5%)</span><span>₦${vat.toLocaleString()}</span></div>`;
        summaryHtml += `<div class="summary-row total"><span>Total</span><span>₦${total.toLocaleString()}</span></div>`;
        checkoutSummary.innerHTML = summaryHtml;
    }

    // Update payment button
    const payBtn = document.getElementById('place-order-btn');
    if (payBtn) payBtn.textContent = `Place order — ₦${total.toLocaleString()}`;
}

// ==================== CHECKOUT ====================
function goToCheckoutStep(step) {
    if (step === 'review') navigateTo('checkout/review');
    else if (step === 'payment') navigateTo('checkout/payment');
    else if (step === 'success') navigateTo('order-success');
}

// ==================== DELIVERY OPTIONS ====================
document.addEventListener('click', function(e) {
    if (e.target.closest('.delivery-option')) {
        document.querySelectorAll('.delivery-option').forEach(opt => opt.classList.remove('active'));
        e.target.closest('.delivery-option').classList.add('active');
        e.target.closest('.delivery-option').querySelector('input').checked = true;
    }
});

// ==================== PAYMENT ====================
document.addEventListener('click', function(e) {
    if (e.target.closest('.payment-option')) {
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        e.target.closest('.payment-option').classList.add('active');
        e.target.closest('.payment-option').querySelector('input').checked = true;
    }
});

// ==================== ORDER TABS ====================
document.addEventListener('click', function(e) {
    if (e.target.closest('.order-tabs-simple button')) {
        document.querySelectorAll('.order-tabs-simple button').forEach(b => b.classList.remove('active'));
        e.target.closest('button').classList.add('active');
    }
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});
