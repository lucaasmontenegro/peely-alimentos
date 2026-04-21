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
    card.innerHTML = `
      <span class="product-emoji">${p.emoji}</span>
      <span class="product-category-badge ${cls}">${label}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <button class="product-order-btn" data-id="${p.id}" data-name="${p.name}">
        + Agregar al pedido
      </button>
    `;
    grid.appendChild(card);
  });

  // Bind add-to-order buttons
  grid.querySelectorAll('.product-order-btn').forEach(btn => {
    btn.addEventListener('click', () => addToOrder(btn.dataset.id, btn.dataset.name));
  });
}

// ---- Add product to order form + scroll ----
function addToOrder(id, name) {
  const checkbox = document.querySelector(`input[name="producto_${id}"]`);
  if (!checkbox) return;

  checkbox.checked = true;
  syncOrderItemStyle(checkbox);

  document.getElementById('contacto').scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    const item = checkbox.closest('.product-order-item');
    if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 700);
}

// ---- Sync checked state styling ----
function syncOrderItemStyle(checkbox) {
  const item = checkbox.closest('.product-order-item');
  if (!item) return;
  item.classList.toggle('checked', checkbox.checked);
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

// ---- Order form checkbox sync ----
document.querySelectorAll('.product-order-item input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => syncOrderItemStyle(cb));
});

// ---- Form submission ----
const form       = document.getElementById('order-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const checked = form.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) {
    alert('Por favor, seleccioná al menos un producto.');
    return;
  }

  submitBtn.textContent = 'Enviando…';
  submitBtn.disabled = true;

  const data = new FormData(form);

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
    if (data.get(`producto_${p.id}`)) {
      const qty = data.get(`qty_${p.id}`);
      body += `  • ${p.name}: ${qty ? qty + ' kg' : 'cantidad a confirmar'}\n`;
    }
  });

  const notas = data.get('notas');
  if (notas) body += `\nNotas: ${notas}`;

  const subject = encodeURIComponent('Nuevo Pedido – Peely Alimentos');
  window.location.href = `mailto:info@peelyalimentos.com.ar?subject=${subject}&body=${encodeURIComponent(body)}`;
}

// ---- Init ----
renderProducts('all');
