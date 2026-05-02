// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile nav ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  toggle.classList.toggle('open');
  links.classList.toggle('open');
});
links?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle?.classList.remove('open');
    links.classList.remove('open');
  });
});

// ---------- Reveal on scroll (with sibling stagger) ----------
const reveals = document.querySelectorAll('.reveal');

// Pre-compute stagger delays for siblings with .reveal
reveals.forEach(el => {
  const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
  if (siblings.length > 1) {
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${Math.min(idx * 70, 600)}ms`;
  }
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => io.observe(el));

// Failsafe: if hero is in the viewport on load, reveal it immediately
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
});

// ---------- Scroll: progress bar + nav scrolled state + hue shift ----------
const root = document.documentElement;
const nav = document.querySelector('.nav');

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = root.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    root.style.setProperty('--scroll', p.toFixed(4));
    nav.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Cursor glow (skip on touch) ----------
if (matchMedia('(hover: hover)').matches) {
  document.body.classList.add('cursor-on');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let tx = mx, ty = my;
  let raf = null;

  function loop() {
    // Smooth lerp toward target
    mx += (tx - mx) * 0.12;
    my += (ty - my) * 0.12;
    root.style.setProperty('--mx', mx + 'px');
    root.style.setProperty('--my', my + 'px');
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!raf) loop();
  });
}

// ---------- Card spotlight (mouse-aware glow per card) ----------
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--cx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--cy', `${e.clientY - rect.top}px`);
  });
});

// ---------- Magnetic primary CTA ----------
document.querySelectorAll('.btn-primary').forEach(btn => {
  const strength = 14;
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translate(${x / strength}px, ${y / strength - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
