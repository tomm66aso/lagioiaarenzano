// ============================================================
// main.js — Navigation, scroll, reveal, footer data
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  loadFooterSettings();
});

// ── Sticky nav ──
function initNav() {
  const nav = document.querySelector('.site-nav');
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger?.addEventListener('click', () => mobileMenu?.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));

  // Active link
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Scroll reveal ──
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// ── Load footer settings from Supabase ──
async function loadFooterSettings() {
  const els = {
    phone: document.querySelectorAll('[data-setting="phone_main"]'),
    wa:    document.querySelectorAll('[data-setting="phone_whatsapp"]'),
    email: document.querySelectorAll('[data-setting="email"]'),
    addr:  document.querySelectorAll('[data-setting="address"]'),
    hours: document.querySelectorAll('[data-setting="hours"]'),
  };

  // Default values (shown before Supabase loads)
  const defaults = {
    phone_main:      '+39 010 4556699',
    phone_whatsapp:  '+39 333 332 3663',
    email:           'adw_elking@yahoo.com',
    address:         'Corso Giacomo Matteotti, 38 — 16011 Arenzano (GE)',
    hours:           'Lun – Dom  12:00 – 23:30',
  };

  // Apply defaults immediately
  applySettings(defaults);

  // Try to fetch from Supabase
  try {
    if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('TUOPROJECT')) return;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=key,value`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    if (!res.ok) return;
    const rows = await res.json();
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    applySettings({ ...defaults, ...settings });
  } catch (_) { /* fall back to defaults */ }
}

function applySettings(s) {
  // phone links
  document.querySelectorAll('[data-setting="phone_main"]').forEach(el => {
    el.textContent = s.phone_main;
    if (el.tagName === 'A') el.href = 'tel:' + s.phone_main.replace(/\s/g,'');
  });
  document.querySelectorAll('[data-setting="phone_whatsapp"]').forEach(el => {
    el.textContent = s.phone_whatsapp;
    if (el.tagName === 'A') el.href = 'https://wa.me/' + s.phone_whatsapp.replace(/\s|\+/g,'');
  });
  document.querySelectorAll('[data-setting="email"]').forEach(el => {
    el.textContent = s.email;
    if (el.tagName === 'A') el.href = 'mailto:' + s.email;
  });
  document.querySelectorAll('[data-setting="address"]').forEach(el => {
    el.textContent = s.address;
  });
  document.querySelectorAll('[data-setting="hours"]').forEach(el => {
    el.textContent = s.hours;
  });
}

// ── Helper: shared nav HTML ──
function getNavHTML(activePage = '') {
  return `
  <nav class="site-nav" id="site-nav">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">
        <img src="https://lirp.cdn-website.com/c6b04a45/dms3rep/multi/opt/logo-pizzeria-kebab-la-gioia-875ee203-1920w.png" alt="La Gioia" onerror="this.style.display='none'">
      </a>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="la-pizzeria.html">La Pizzeria</a></li>
        <li><a href="il-menu.html">Il Menù</a></li>
        <li><a href="il-locale.html">Il Locale</a></li>
        <li><a href="contatti.html">Contatti</a></li>
      </ul>
      <div class="nav-cta">
        <a href="tel:+390104556699" class="nav-phone">
          📞 <span data-setting="phone_main">+39 010 4556699</span>
        </a>
        <a href="https://wa.me/393333323663" class="nav-wa" title="WhatsApp">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <button class="nav-burger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
  <div class="mobile-menu">
    <button class="mobile-close" aria-label="Chiudi">✕</button>
    <a href="index.html">Home</a>
    <a href="la-pizzeria.html">La Pizzeria</a>
    <a href="il-menu.html">Il Menù</a>
    <a href="il-locale.html">Il Locale</a>
    <a href="contatti.html">Contatti</a>
  </div>`;
}

function getFooterHTML() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-logo">
          <img src="https://lirp.cdn-website.com/c6b04a45/dms3rep/multi/opt/logo-pizzeria-kebab-la-gioia-875ee203-1920w.png" alt="La Gioia" onerror="this.style.display='none'">
          <p>Pizzeria & Kebab di qualità<br>ad Arenzano, Liguria.</p>
        </div>
        <div class="footer-col">
          <h5>Naviga</h5>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="la-pizzeria.html">La Pizzeria</a></li>
            <li><a href="il-menu.html">Il Menù</a></li>
            <li><a href="il-locale.html">Il Locale</a></li>
            <li><a href="contatti.html">Contatti</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Orari</h5>
          <p data-setting="hours">Lun – Dom  12:00 – 23:30</p>
          <p style="margin-top:12px;font-size:0.8rem;color:var(--muted)">P. IVA 02815380999</p>
        </div>
        <div class="footer-col">
          <h5>Contatti</h5>
          <p>
            <a href="tel:+390104556699" data-setting="phone_main">+39 010 4556699</a><br>
            <a href="https://wa.me/393333323663" data-setting="phone_whatsapp">+39 333 332 3663</a><br>
            <a href="mailto:adw_elking@yahoo.com" data-setting="email">adw_elking@yahoo.com</a>
          </p>
          <p style="margin-top:8px;" data-setting="address">Corso Giacomo Matteotti, 38<br>16011 Arenzano (GE)</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 La Gioia Pizzeria & Kebab · Arenzano (GE)</p>
        <p><a href="admin/index.html">Accesso CMS</a></p>
      </div>
    </div>
  </footer>`;
}
