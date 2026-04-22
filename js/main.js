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
  },
  {
    id: 'cebolla_juliana',
    name: 'Cebolla Cortada juliana',
    category: 'cebollas',
    emoji: '🧅',
    desc: 'Cebolla finamente cortada en juliana. Perfecta para caramelizar o en salteados rápidos.',
  },
  {
    id: 'mix_wok',
    name: 'Mix Wok',
    category: 'mix',
    emoji: '🥢',
    desc: 'Mezcla especial de vegetales para salteados al wok. Colorida, nutritiva y lista al fuego.',
  },
  {
    id: 'mix_sopa',
    name: 'Mix para Sopa',
    category: 'mix',
    emoji: '🍲',
    desc: 'Blend de verduras ideal para sopas, caldos y potajes. Todo el sabor en un solo pack.',
  },
  {
    id: 'mix_horno',
    name: 'Mix para Horno',
    category: 'mix',
    emoji: '🥘',
    desc: 'Combinación perfecta de vegetales para asar al horno. Versátil y de sabor intenso.',
  },
  {
    id: 'mix_pimientos',
    name: 'Mix Pimientos',
    category: 'mix',
    emoji: '🫑',
    desc: 'Pimientos rojos, verdes y amarillos cortados. Color y sabor para cualquier preparación.',
  },
  {
    id: 'brocoli',
    name: 'Brócoli',
    category: 'vegetales',
    emoji: '🥦',
    desc: 'Brócoli fresco congelado en floretes. Rico en vitaminas y listo para cocinar.',
  },
  {
    id: 'espinaca',
    name: 'Espinaca cruda',
    category: 'vegetales',
    emoji: '🥬',
    desc: 'Espinaca cruda congelada al natural. Perfecta para rellenos, tortillas y tartas.',
  },
  {
    id: 'papa',
    name: 'Papa francesa',
    category: 'vegetales',
    emoji: '🍟',
    desc: 'Papas cortadas en bastones. Listas para freír o al horno, crujientes y doradas.',
    img: 'assets/images/productos/papas-francesas.jpg',
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

// ---- Recipe toggle ----
document.querySelectorAll('.recipe-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const open = target.classList.toggle('visible');
    btn.textContent = open ? 'Ocultar receta ↑' : 'Ver receta ↓';
  });
});

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

  submitBtn.textContent = 'Enviando…';
  submitBtn.disabled = true;

  const data = new FormData(form);
  PRODUCTS.forEach(p => {
    if (orderQty[p.id] > 0) data.set(`producto_${p.id}`, `${orderQty[p.id]} pack(s) × 500g`);
  });

  try {
    // CONFIGURACIÓN: reemplazá "YOUR_FORM_ID" con el ID de tu formulario en Formspree.
    // Registrate gratis en https://formspree.io → New Form → copiá el ID.
    const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
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
    // Fallback: abrir cliente de email con los datos pre-completados
    openMailtoFallback(data);
    submitBtn.textContent = 'Enviar Pedido →';
    submitBtn.disabled = false;
  }
});

function openMailtoFallback(data) {
  let body = 'NUEVO PEDIDO – PEELY ALIMENTOS\n\n';
  body += `Nombre:   ${data.get('nombre')}\n`;
  body += `Email:    ${data.get('email')}\n`;
  body += `Teléfono: ${data.get('telefono')}\n`;
  body += `Empresa:  ${data.get('empresa') || '—'}\n\n`;
  body += 'PRODUCTOS SOLICITADOS:\n';

  PRODUCTS.forEach(p => {
    if (orderQty[p.id] > 0) {
      body += `  • ${p.name}: ${orderQty[p.id]} pack(s) × 500g = ${orderQty[p.id] * 0.5} kg\n`;
    }
  });

  const notas = data.get('notas');
  if (notas) body += `\nNotas: ${notas}`;

  const subject = encodeURIComponent('Nuevo Pedido – Peely Alimentos');
  window.location.href = `mailto:info@peelyalimentos.com.ar?subject=${subject}&body=${encodeURIComponent(body)}`;
}

// ---- Init ----
renderProducts('all');
renderOrderGrid();

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

// ---- Subs form submission ----
const subsForm      = document.getElementById('subs-form');
const subsSubmitBtn = document.getElementById('subs-submit-btn');
const subsSuccess   = document.getElementById('subs-success');

subsForm.addEventListener('submit', async e => {
  e.preventDefault();

  const selected = PRODUCTS.filter(p => subsQty[p.id] > 0);
  const totalPacks = selected.reduce((sum, p) => sum + subsQty[p.id], 0);
  if (totalPacks === 0) {
    alert('Por favor, seleccioná al menos un producto para tu suscripción.');
    return;
  }
  if (totalPacks < 6) {
    alert(`El mínimo para suscribirse es 6 packs en total. Llevas ${totalPacks}.`);
    return;
  }

  const nombre   = subsForm.querySelector('[name="subs_nombre"]').value.trim();
  const email    = subsForm.querySelector('[name="subs_email"]').value.trim();
  const telefono = subsForm.querySelector('[name="subs_telefono"]').value.trim();
  if (!nombre || !email || !telefono) {
    alert('Por favor, completá los campos obligatorios (nombre, email y teléfono).');
    return;
  }

  subsSubmitBtn.textContent = 'Enviando…';
  subsSubmitBtn.disabled = true;

  const data = new FormData(subsForm);
  selected.forEach(p => data.set(`subs_producto_${p.id}`, `${subsQty[p.id]} pack(s) × 500g`));

  try {
    const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
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
    openSubsMailtoFallback(nombre, email, telefono,
      subsForm.querySelector('[name="subs_empresa"]').value,
      subsForm.querySelector('[name="subs_notas"]').value,
      selected);
    subsSubmitBtn.textContent = 'Suscribirme →';
    subsSubmitBtn.disabled = false;
  }
});

function openSubsMailtoFallback(nombre, email, telefono, empresa, notas, selected) {
  let body = 'NUEVA SUSCRIPCIÓN MENSUAL – PEELY ALIMENTOS\n\n';
  body += `Nombre:   ${nombre}\n`;
  body += `Email:    ${email}\n`;
  body += `Teléfono: ${telefono}\n`;
  body += `Empresa:  ${empresa || '—'}\n\n`;
  body += 'PRODUCTOS POR MES:\n';
  selected.forEach(p => {
    body += `  • ${p.name}: ${subsQty[p.id]} pack(s) × 500g = ${subsQty[p.id] * 0.5} kg\n`;
  });
  const totalKg = selected.reduce((sum, p) => sum + subsQty[p.id] * 0.5, 0);
  body += `\nPeso total mensual: ${totalKg} kg\n`;
  if (notas) body += `\nNotas: ${notas}`;

  const subject = encodeURIComponent('Nueva Suscripción Mensual – Peely Alimentos');
  window.location.href = `mailto:info@peelyalimentos.com.ar?subject=${subject}&body=${encodeURIComponent(body)}`;
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
