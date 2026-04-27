// ============================================
//  PEELY ALIMENTOS — MAIN JS
// ============================================

const PRODUCTS = [
  {
    id: 'cebolla_cubitos',
    name: 'Cebolla Picada cubitos',
    category: 'cebollas',
    emoji: '🧅',
    desc: 'Cebolla blanca cortada en cubitos, lista para usar. Ideal para sofrito, guisos y salsas.',
    img: 'assets/images/productos/cebolla-cubitos.png',
    imgHover: 'assets/images/productos/cebolla-cubitos-hover.png',
  },
  {
    id: 'cebolla_juliana',
    name: 'Cebolla Cortada juliana',
    category: 'cebollas',
    emoji: '🧅',
    desc: 'Cebolla finamente cortada en juliana. Perfecta para caramelizar o en salteados rápidos.',
    img: 'assets/images/productos/cebolla-juliana.png',
    imgHover: 'assets/images/productos/cebolla-juliana-hover.png',
  },
  {
    id: 'mix_wok',
    name: 'Mix Wok',
    category: 'mix',
    emoji: '🥢',
    desc: 'Mezcla especial de vegetales para salteados al wok. Colorida, nutritiva y lista al fuego.',
    img: 'assets/images/productos/mix-wok.png',
    imgHover: 'assets/images/productos/mix-wok-hover.png',
  },
  {
    id: 'papa',
    name: 'Papa francesa',
    category: 'vegetales',
    emoji: '🍟',
    desc: 'Papas cortadas en bastones. Listas para freír o al horno, crujientes y doradas.',
    img: 'assets/images/productos/papas-francesas.png',
    imgHover: 'assets/images/productos/papas-francesas-hover.png',
  },
];

const BADGE = {
  cebollas:  { label: 'Cebollas',  cls: 'badge-cebollas' },
  mix:       { label: 'Mix',       cls: 'badge-mix' },
  vegetales: { label: 'Vegetales', cls: 'badge-vegetales' },
};

// ---- Render product cards ----
function renderProducts(filter) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  list.forEach((p, i) => {
    const { label, cls } = BADGE[p.category];
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.055}s`;
    card.innerHTML = p.img
      ? `<div class="product-img-wrap">
           <img src="${p.img}" alt="${p.name}" class="product-img product-img-base">
           ${p.imgHover ? `<img src="${p.imgHover}" alt="${p.name} cocinado" class="product-img product-img-hover">` : ''}
         </div>
         <div class="product-body">
           <span class="product-category-badge ${cls}">${label}</span>
           <h3>${p.name}</h3>
           <p>${p.desc}</p>
           <button class="product-order-btn" data-id="${p.id}" data-name="${p.name}">+ Agregar al pedido</button>
         </div>`
      : `<div class="product-body">
           <span class="product-emoji">${p.emoji}</span>
           <span class="product-category-badge ${cls}">${label}</span>
           <h3>${p.name}</h3>
           <p>${p.desc}</p>
           <button class="product-order-btn" data-id="${p.id}" data-name="${p.name}">+ Agregar al pedido</button>
         </div>`;
    grid.appendChild(card);
  });

  // Bind add-to-order buttons
  grid.querySelectorAll('.product-order-btn').forEach(btn => {
    btn.addEventListener('click', () => addToOrder(btn.dataset.id));
  });
}

// ---- Order form stepper ----
const orderQty = {};
PRODUCTS.forEach(p => { orderQty[p.id] = 0; });

function renderOrderGrid() {
  const grid = document.getElementById('order-products-grid');
  if (!grid) return;
  grid.innerHTML = '';

  PRODUCTS.forEach(p => {
    const qty = orderQty[p.id];
    const card = document.createElement('div');
    card.className = 'subs-product-card' + (qty > 0 ? ' active' : '');
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="subs-product-info">
        <span class="subs-product-emoji">${p.emoji}</span>
        <div>
          <span class="subs-product-name">${p.name}</span>
          <span class="subs-product-unit">500 g / unidad</span>
        </div>
      </div>
      <div class="subs-stepper">
        <button type="button" class="subs-stepper-btn order-dec" data-id="${p.id}" ${qty === 0 ? 'disabled' : ''}>−</button>
        <span class="subs-stepper-qty">${qty}</span>
        <button type="button" class="subs-stepper-btn order-inc" data-id="${p.id}">+</button>
      </div>`;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.order-inc').forEach(btn => {
    btn.addEventListener('click', () => changeOrderQty(btn.dataset.id, 1));
  });
  grid.querySelectorAll('.order-dec').forEach(btn => {
    btn.addEventListener('click', () => changeOrderQty(btn.dataset.id, -1));
  });
}

function changeOrderQty(id, delta) {
  orderQty[id] = Math.max(0, orderQty[id] + delta);
  renderOrderGrid();
  updateOrderSummary();
}

function updateOrderSummary() {
  const summaryEl = document.getElementById('order-summary');
  const listEl    = document.getElementById('order-summary-list');
  const packsEl   = document.getElementById('order-summary-packs');
  const weightEl  = document.getElementById('order-summary-weight');

  const selected   = PRODUCTS.filter(p => orderQty[p.id] > 0);
  const totalPacks = selected.reduce((sum, p) => sum + orderQty[p.id], 0);
  const totalKg    = (totalPacks * 0.5).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });

  summaryEl.style.display = selected.length > 0 ? 'block' : 'none';

  listEl.innerHTML = selected.map(p =>
    `<span class="order-summary-item">${p.emoji} ${p.name} <strong>${orderQty[p.id]}</strong></span>`
  ).join('');

  packsEl.textContent = `${totalPacks} pack${totalPacks !== 1 ? 's' : ''}`;
  weightEl.textContent = `${totalKg} kg`;
}

// ---- Add product to order form + scroll ----
function addToOrder(id) {
  orderQty[id] = Math.max(1, orderQty[id] + 1);
  renderOrderGrid();
  updateOrderSummary();

  document.getElementById('contacto').scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    const card = document.querySelector(`#order-products-grid [data-id="${id}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 700);
}

// ---- Filter tabs ----
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderProducts(tab.dataset.filter);
  });
});

// ---- Recipe data ----
const RECIPES = {
  wok: {
    icon: '🥢',
    title: 'Salteado de Vegetales al Wok',
    time: '15 min', diff: 'Fácil', diffCls: 'easy',
    desc: 'Un salteado rápido y nutritivo con el sabor del Asia en tu cocina. Sin precocción, listo al fuego.',
    product: 'Mix Wok Peely',
    img: 'assets/images/recetas/receta-wok.png',
    imgAlt: 'Salteado de Vegetales al Wok',
    videoId: '7630175689978776850',
    steps: [
      'Calentar un wok o sartén grande a fuego alto con un chorro de aceite.',
      'Agregar el Mix Wok Peely directamente congelado.',
      'Saltear 5–7 minutos revolviendo constantemente.',
      'Condimentar con salsa de soja, ajo y jengibre al gusto.',
      'Servir inmediatamente.',
    ],
  },
  sopa: {
    icon: '🍲',
    title: 'Sopa Casera de Vegetales',
    time: '25 min', diff: 'Fácil', diffCls: 'easy',
    desc: 'Una sopa reconfortante lista en minutos, ideal para el invierno o como entrada de un menú.',
    product: 'Mix para Sopa Peely',
    img: 'assets/images/recetas/receta-wok.png',
    imgAlt: 'Sopa Casera de Vegetales',
    videoId: '7630175689978776850',
    steps: [
      'Llevar 1 litro de caldo de verduras a hervor.',
      'Agregar el Mix para Sopa Peely.',
      'Cocinar 15–20 minutos a fuego medio.',
      'Condimentar con sal, pimienta y perejil fresco.',
      'Servir caliente.',
    ],
  },
  brocoli: {
    icon: '🥦',
    title: 'Brócoli Gratinado',
    time: '30 min', diff: 'Fácil', diffCls: 'easy',
    desc: 'Un clásico irresistible: brócoli tierno cubierto de queso derretido y gratinado al horno.',
    product: 'Brócoli Peely',
    img: 'assets/images/recetas/receta-wok.png',
    imgAlt: 'Brócoli Gratinado',
    videoId: '7630175689978776850',
    steps: [
      'Precalentar el horno a 200 °C.',
      'Descongelar levemente el Brócoli Peely.',
      'Disponer en fuente para horno, cubrir con crema y queso rallado.',
      'Salpimentar y agregar nuez moscada al gusto.',
      'Hornear 20 minutos hasta gratinar.',
    ],
  },
  tortilla: {
    icon: '🫑',
    title: 'Tortilla de Espinaca y Pimientos',
    time: '20 min', diff: 'Fácil', diffCls: 'easy',
    desc: 'Una tortilla colorida y nutritiva. Perfecta para cualquier comida del día, con muy poco esfuerzo.',
    product: 'Espinaca + Mix Pimientos Peely',
    img: 'assets/images/recetas/receta-wok.png',
    imgAlt: 'Tortilla de Espinaca y Pimientos',
    videoId: '7630175689978776850',
    steps: [
      'Saltear Espinaca y Mix Pimientos Peely en sartén con aceite, 5 min.',
      'Batir 4 huevos con sal y pimienta.',
      'Verter los huevos sobre los vegetales salteados.',
      'Cocinar a fuego medio-bajo, 4–5 min por cada lado.',
      'Servir caliente o a temperatura ambiente.',
    ],
  },
};

let currentFeaturedId = 'wok';

function renderRecipeCards() {
  const grid = document.querySelector('.recipes-grid');
  if (!grid) return;

  const ids = Object.keys(RECIPES).filter(id => id !== currentFeaturedId);
  grid.innerHTML = ids.map((id, i) => {
    const r = RECIPES[id];
    return `
      <div class="recipe-card reveal visible" data-recipe="${id}" style="transition-delay: ${i * 0.1}s">
        <div class="recipe-icon">${r.icon}</div>
        <div class="recipe-meta">
          <span>⏱ ${r.time}</span>
          <span class="recipe-diff ${r.diffCls}">${r.diff}</span>
        </div>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
        <div class="recipe-product">Producto: <strong>${r.product}</strong></div>
        <button class="btn btn-ghost recipe-select" data-recipe="${id}">Ver receta →</button>
      </div>`;
  }).join('');

  grid.querySelectorAll('.recipe-select').forEach(btn => {
    btn.addEventListener('click', () => showFeaturedRecipe(btn.dataset.recipe));
  });
}

function showFeaturedRecipe(id) {
  const r = RECIPES[id];
  if (!r) return;

  currentFeaturedId = id;

  document.getElementById('recipe-featured-title').textContent = r.title;

  const img = document.getElementById('recipe-featured-img');
  img.src = r.img;
  img.alt = r.imgAlt;

  document.getElementById('recipe-featured-meta').innerHTML =
    `<span>⏱ ${r.time}</span><span class="recipe-diff ${r.diffCls}">${r.diff}</span>`;

  document.getElementById('recipe-featured-desc').textContent = r.desc;
  document.getElementById('recipe-featured-product').innerHTML = `Producto: <strong>${r.product}</strong>`;
  document.getElementById('recipe-featured-steps').innerHTML = r.steps.map(s => `<li>${s}</li>`).join('');

  const iframe = document.getElementById('recipe-tiktok-iframe');
  iframe.src = `https://www.tiktok.com/embed/v2/${r.videoId}`;

  renderRecipeCards();

  document.getElementById('recipe-featured-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Navbar scroll state ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
}, { passive: true });

// ---- Active nav link on scroll ----
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 90;

  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const inView = scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', inView);
  });
}

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Scroll reveal ----
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ---- Confirmation modal ----
let pendingFormAction = null;

function showConfirmModal(title, bodyHTML, onConfirm) {
  document.getElementById('confirm-modal-title').textContent = title;
  document.getElementById('confirm-modal-body').innerHTML = bodyHTML;
  pendingFormAction = onConfirm;
  document.getElementById('confirm-modal').classList.add('open');
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').classList.remove('open');
  pendingFormAction = null;
}

document.getElementById('confirm-modal-cancel').addEventListener('click', closeConfirmModal);
document.getElementById('confirm-modal-ok').addEventListener('click', () => {
  const action = pendingFormAction;
  closeConfirmModal();
  if (action) action();
});
document.getElementById('confirm-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeConfirmModal();
});

function buildOrderSummaryHTML(data) {
  const nombre = `${data.get('nombre')} ${data.get('apellido')}`;
  let dir = `${data.get('calle')} ${data.get('numero')}`;
  if (data.get('piso'))  dir += `, Piso ${data.get('piso')}`;
  if (data.get('depto')) dir += `, Depto ${data.get('depto')}`;
  dir += `, ${data.get('ciudad')}`;

  const selected   = PRODUCTS.filter(p => orderQty[p.id] > 0);
  const totalPacks = selected.reduce((sum, p) => sum + orderQty[p.id], 0);
  const totalKg    = (totalPacks * 0.5).toLocaleString('es-AR', { maximumFractionDigits: 1 });

  const productLines = selected.map(p =>
    `<li>${p.name}<span>${orderQty[p.id]} pack${orderQty[p.id] > 1 ? 's' : ''} · ${(orderQty[p.id] * 0.5)} kg</span></li>`
  ).join('');

  return `
    <div class="confirm-section">
      <div class="confirm-section-label">Tus datos</div>
      <div class="confirm-row"><span>${nombre}</span></div>
      <div class="confirm-row"><span>${data.get('email')}</span></div>
      <div class="confirm-row"><span>${data.get('telefono')}</span></div>
      <div class="confirm-row"><span>${dir}</span></div>
    </div>
    <div class="confirm-section">
      <div class="confirm-section-label">Productos</div>
      <ul class="confirm-products-list">${productLines}</ul>
    </div>
    <div class="confirm-total">
      <span>Total del pedido</span>
      <span>${totalPacks} pack${totalPacks !== 1 ? 's' : ''} · ${totalKg} kg</span>
    </div>
    ${data.get('entrega_express') ? '<div class="confirm-express">⚡ Entrega express solicitada</div>' : ''}
  `;
}

// ---- WhatsApp link builder ----
function buildWaLink(phone, message) {
  const clean = phone.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

function orderWaMessage(data, selected) {
  const nombre = data.get('nombre');
  const productos = selected.map(p => `${p.name} x${orderQty[p.id]}`).join(', ');
  const totalPacks = selected.reduce((s, p) => s + orderQty[p.id], 0);
  return `Hola ${nombre}, recibimos tu pedido de Peely Alimentos.\n\nProductos: ${productos}\nTotal: ${totalPacks} pack${totalPacks !== 1 ? 's' : ''} · ${totalPacks * 0.5} kg\n\nTe contactamos pronto para coordinar la entrega. ¡Gracias!`;
}

function subsWaMessage(nombre, selected) {
  const productos = selected.map(p => `${p.name} x${subsQty[p.id]}`).join(', ');
  const totalPacks = selected.reduce((s, p) => s + subsQty[p.id], 0);
  return `Hola ${nombre}, recibimos tu suscripción mensual de Peely Alimentos.\n\nProductos: ${productos}\nTotal mensual: ${totalPacks} pack${totalPacks !== 1 ? 's' : ''} · ${totalPacks * 0.5} kg\n\nTe contactamos para confirmar los detalles. ¡Gracias!`;
}

// ---- Form submission ----
const form       = document.getElementById('order-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const hasProducts = PRODUCTS.some(p => orderQty[p.id] > 0);
  if (!hasProducts) {
    alert('Por favor, seleccioná al menos un producto.');
    return;
  }

  const data = new FormData(form);
  PRODUCTS.forEach(p => {
    if (orderQty[p.id] > 0) data.set(`producto_${p.id}`, `${orderQty[p.id]} pack(s) × 500g`);
  });

  showConfirmModal('Confirmá tu pedido', buildOrderSummaryHTML(data), async () => {
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled = true;

    const selected = PRODUCTS.filter(p => orderQty[p.id] > 0);
    data.set('whatsapp_link', buildWaLink(data.get('telefono'), orderWaMessage(data, selected)));

    try {
      const res = await fetch('https://formspree.io/f/xbdqeogy', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.querySelector('.form-submit').style.display = 'none';
        successMsg.classList.add('visible');
      } else {
        throw new Error('server_error');
      }
    } catch {
      openMailtoFallback(data);
      submitBtn.textContent = 'Enviar Pedido →';
      submitBtn.disabled = false;
    }
  });
});

function openMailtoFallback(data) {
  let body = 'NUEVO PEDIDO – PEELY ALIMENTOS\n\n';
  body += `Nombre:   ${data.get('nombre')} ${data.get('apellido')}\n`;
  body += `Email:    ${data.get('email')}\n`;
  body += `Teléfono: ${data.get('telefono')}\n`;

  let dir = `${data.get('calle')} ${data.get('numero')}`;
  if (data.get('piso'))  dir += `, Piso ${data.get('piso')}`;
  if (data.get('depto')) dir += `, Depto ${data.get('depto')}`;
  body += `Dirección: ${dir}\n\n`;

  body += `, ${data.get('ciudad')}\n`;
  if (data.get('entrega_express')) body += '⚡ SOLICITA ENTREGA EXPRESS\n\n';

  body += 'PRODUCTOS SOLICITADOS:\n';
  PRODUCTS.forEach(p => {
    if (orderQty[p.id] > 0) {
      body += `  • ${p.name}: ${orderQty[p.id]} pack(s) × 500g = ${orderQty[p.id] * 0.5} kg\n`;
    }
  });

  const notas = data.get('notas');
  if (notas) body += `\nNotas: ${notas}`;

  const subject = encodeURIComponent('Nuevo Pedido – Peely Alimentos');
  window.location.href = `mailto:contactos@peelyalimentos.com?subject=${subject}&body=${encodeURIComponent(body)}`;
}

// ---- Init ----
renderProducts('all');
renderOrderGrid();
renderRecipeCards();

// ============================================
//  SUSCRIPCIÓN MENSUAL
// ============================================

const subsQty = {};
PRODUCTS.forEach(p => { subsQty[p.id] = 0; });

function renderSubsGrid() {
  const grid = document.getElementById('subs-grid');
  if (!grid) return;
  grid.innerHTML = '';

  PRODUCTS.forEach(p => {
    const qty = subsQty[p.id];
    const card = document.createElement('div');
    card.className = 'subs-product-card' + (qty > 0 ? ' active' : '');
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="subs-product-info">
        <span class="subs-product-emoji">${p.emoji}</span>
        <div>
          <span class="subs-product-name">${p.name}</span>
          <span class="subs-product-unit">500 g / unidad</span>
        </div>
      </div>
      <div class="subs-stepper">
        <button type="button" class="subs-stepper-btn subs-dec" data-id="${p.id}" ${qty === 0 ? 'disabled' : ''}>−</button>
        <span class="subs-stepper-qty" id="subs-qty-${p.id}">${qty}</span>
        <button type="button" class="subs-stepper-btn subs-inc" data-id="${p.id}">+</button>
      </div>`;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.subs-inc').forEach(btn => {
    btn.addEventListener('click', () => changeSubsQty(btn.dataset.id, 1));
  });
  grid.querySelectorAll('.subs-dec').forEach(btn => {
    btn.addEventListener('click', () => changeSubsQty(btn.dataset.id, -1));
  });
}

function changeSubsQty(id, delta) {
  subsQty[id] = Math.max(0, subsQty[id] + delta);
  renderSubsGrid();
  updateSubsSummary();
}

function updateSubsSummary() {
  const emptyEl   = document.getElementById('subs-summary-empty');
  const listEl    = document.getElementById('subs-summary-list');
  const footerEl  = document.getElementById('subs-summary-footer');
  const packsEl   = document.getElementById('subs-total-packs');
  const weightEl  = document.getElementById('subs-total-weight');

  const selected = PRODUCTS.filter(p => subsQty[p.id] > 0);
  const totalPacks = selected.reduce((sum, p) => sum + subsQty[p.id], 0);
  const totalKg = (totalPacks * 0.5).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });

  emptyEl.style.display  = selected.length === 0 ? 'block' : 'none';
  footerEl.style.display = selected.length > 0  ? 'flex'  : 'none';

  listEl.innerHTML = selected.map(p => `
    <li class="subs-summary-item">
      <span class="subs-summary-item-name">${p.emoji} ${p.name}</span>
      <span class="subs-summary-item-qty">${subsQty[p.id]} pack${subsQty[p.id] > 1 ? 's' : ''}</span>
    </li>`).join('');

  packsEl.textContent = totalPacks;
  weightEl.textContent = `${totalKg} kg`;

  const minEl = document.getElementById('subs-min-warning');
  if (minEl) minEl.style.display = totalPacks > 0 && totalPacks < 6 ? 'block' : 'none';
}

function buildSubsSummaryHTML(nombre, apellido, email, telefono, calle, numero, piso, depto, ciudad, selected) {
  let dir = `${calle} ${numero}`;
  if (piso)  dir += `, Piso ${piso}`;
  if (depto) dir += `, Depto ${depto}`;
  dir += `, ${ciudad}`;

  const totalPacks = selected.reduce((sum, p) => sum + subsQty[p.id], 0);
  const totalKg    = (totalPacks * 0.5).toLocaleString('es-AR', { maximumFractionDigits: 1 });

  const productLines = selected.map(p =>
    `<li>${p.name}<span>${subsQty[p.id]} pack${subsQty[p.id] > 1 ? 's' : ''} · ${(subsQty[p.id] * 0.5)} kg</span></li>`
  ).join('');

  return `
    <div class="confirm-section">
      <div class="confirm-section-label">Tus datos</div>
      <div class="confirm-row"><span>${nombre} ${apellido}</span></div>
      <div class="confirm-row"><span>${email}</span></div>
      <div class="confirm-row"><span>${telefono}</span></div>
      <div class="confirm-row"><span>${dir}</span></div>
    </div>
    <div class="confirm-section">
      <div class="confirm-section-label">Productos mensuales</div>
      <ul class="confirm-products-list">${productLines}</ul>
    </div>
    <div class="confirm-total">
      <span>Total por mes</span>
      <span>${totalPacks} pack${totalPacks !== 1 ? 's' : ''} · ${totalKg} kg</span>
    </div>
  `;
}

// ---- Subs form submission ----
const subsForm      = document.getElementById('subs-form');
const subsSubmitBtn = document.getElementById('subs-submit-btn');
const subsSuccess   = document.getElementById('subs-success');

subsForm.addEventListener('submit', async e => {
  e.preventDefault();

  const selected   = PRODUCTS.filter(p => subsQty[p.id] > 0);
  const totalPacks = selected.reduce((sum, p) => sum + subsQty[p.id], 0);
  if (totalPacks === 0) {
    alert('Por favor, seleccioná al menos un producto para tu suscripción.');
    return;
  }
  if (totalPacks < 6) {
    alert(`El mínimo para suscribirse es 6 packs en total. Llevás ${totalPacks}.`);
    return;
  }

  const nombre   = subsForm.querySelector('[name="subs_nombre"]').value.trim();
  const apellido = subsForm.querySelector('[name="subs_apellido"]').value.trim();
  const email    = subsForm.querySelector('[name="subs_email"]').value.trim();
  const telefono = subsForm.querySelector('[name="subs_telefono"]').value.trim();
  const calle    = subsForm.querySelector('[name="subs_calle"]').value.trim();
  const numero   = subsForm.querySelector('[name="subs_numero"]').value.trim();
  const piso     = subsForm.querySelector('[name="subs_piso"]').value;
  const depto    = subsForm.querySelector('[name="subs_depto"]').value;
  const ciudad   = subsForm.querySelector('[name="subs_ciudad"]').value.trim();
  const notas    = subsForm.querySelector('[name="subs_notas"]').value;

  if (!nombre || !apellido || !email || !telefono || !calle || !numero || !ciudad) {
    alert('Por favor, completá todos los campos obligatorios.');
    return;
  }

  showConfirmModal(
    'Confirmá tu suscripción',
    buildSubsSummaryHTML(nombre, apellido, email, telefono, calle, numero, piso, depto, ciudad, selected),
    async () => {
      subsSubmitBtn.textContent = 'Enviando…';
      subsSubmitBtn.disabled = true;

      const data = new FormData(subsForm);
      selected.forEach(p => data.set(`subs_producto_${p.id}`, `${subsQty[p.id]} pack(s) × 500g`));
      data.set('whatsapp_link', buildWaLink(telefono, subsWaMessage(nombre, selected)));

      try {
        const res = await fetch('https://formspree.io/f/xkokarrg', {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          subsForm.querySelector('.subs-submit-btn').style.display = 'none';
          subsForm.querySelector('.form-note').style.display = 'none';
          subsSuccess.classList.add('visible');
        } else {
          throw new Error('server_error');
        }
      } catch {
        openSubsMailtoFallback(nombre, apellido, email, telefono, calle, numero, piso, depto, ciudad, notas, selected);
        subsSubmitBtn.textContent = 'Suscribirme →';
        subsSubmitBtn.disabled = false;
      }
    }
  );
});

function openSubsMailtoFallback(nombre, apellido, email, telefono, calle, numero, piso, depto, ciudad, notas, selected) {
  let body = 'NUEVA SUSCRIPCIÓN MENSUAL – PEELY ALIMENTOS\n\n';
  body += `Nombre:   ${nombre} ${apellido}\n`;
  body += `Email:    ${email}\n`;
  body += `Teléfono: ${telefono}\n`;
  let dir = `${calle} ${numero}`;
  if (piso)  dir += `, Piso ${piso}`;
  if (depto) dir += `, Depto ${depto}`;
  body += `Dirección: ${dir}, ${ciudad}\n\n`;
  body += 'PRODUCTOS POR MES:\n';
  selected.forEach(p => {
    body += `  • ${p.name}: ${subsQty[p.id]} pack(s) × 500g = ${subsQty[p.id] * 0.5} kg\n`;
  });
  const totalKg = selected.reduce((sum, p) => sum + subsQty[p.id] * 0.5, 0);
  body += `\nPeso total mensual: ${totalKg} kg\n`;
  if (notas) body += `\nNotas: ${notas}`;

  const subject = encodeURIComponent('Nueva Suscripción Mensual – Peely Alimentos');
  window.location.href = `mailto:contactos@peelyalimentos.com?subject=${subject}&body=${encodeURIComponent(body)}`;
}

renderSubsGrid();

// ---- Subs expand toggle ----
document.getElementById('subs-open-btn').addEventListener('click', () => {
  const layout = document.getElementById('subs-layout');
  const cta    = document.querySelector('.subs-cta');
  cta.style.display    = 'none';
  layout.style.display = 'grid';
  layout.classList.add('subs-layout-entering');
  layout.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
