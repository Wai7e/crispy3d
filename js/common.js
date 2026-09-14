/* ============================================================
   Shared: helpers, liquid glass, scroll, cursor, nav, reveal, lightbox
   ============================================================ */
const IMG = (n, t) => `img/${n}${t ? '_t' : ''}.webp`;
const HERO_IMG = 'p3_001';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
const isChromium = !!window.chrome && !/Firefox/i.test(navigator.userAgent);

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   Liquid glass — displacement maps for feImage (Chromium only)
   R = x offset, G = y offset, 128 = neutral
   ============================================================ */
function makeMap(w, h, kind) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const r = kind === 'lens' ? Math.min(w, h) / 2 : h / 2;
  const band = kind === 'lens' ? r : 16;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let dx = 0, dy = 0;
      if (kind === 'lens') {
        const cx = x - w / 2, cy = y - h / 2;
        const dist = Math.hypot(cx, cy);
        if (dist < r) {
          const t = dist / r;
          const k = -Math.pow(t, 2.2) * 0.9;
          dx = (cx / (dist || 1)) * k; dy = (cy / (dist || 1)) * k;
        }
      } else {
        const qx = Math.abs(x - w / 2) - (w / 2 - r), qy = Math.abs(y - h / 2) - (h / 2 - r);
        const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
        const sd = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
        if (sd > -band && sd <= 0) {
          const t = 1 - (-sd / band);
          const k = -Math.pow(t, 1.8);
          const nx = Math.sign(x - w / 2) * (qx > 0 ? ox : (qx > qy ? 1 : 0));
          const ny = Math.sign(y - h / 2) * (qy > 0 ? oy : (qy >= qx ? 1 : 0));
          const l = Math.hypot(nx, ny) || 1;
          dx = (nx / l) * k; dy = (ny / l) * k;
        }
      }
      const i = (y * w + x) * 4;
      d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function initLiquid() {
  if (!isChromium || reduced) return;
  const nav = $('.nav__pill');
  const navMap = $('#liquid-nav-map');
  const lensMap = $('#liquid-lens-map');
  const upd = () => {
    const r = nav.getBoundingClientRect();
    navMap.setAttribute('href', makeMap(Math.round(r.width), Math.round(r.height), 'pill'));
    nav.classList.add('has-liquid');
  };
  upd();
  new ResizeObserver(upd).observe(nav);
  lensMap.setAttribute('href', makeMap(64, 64, 'lens'));
  $('.cursor').classList.add('has-liquid');
}

/* ============================================================
   Smooth scroll
   ============================================================ */
let lenis;
function initScroll() {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id); if (!el) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    lenis.start();
    lenis.scrollTo(el, { offset: id === '#top' ? 0 : -90, duration: 1.4 });
  }));
}

/* ============================================================
   Cursor
   ============================================================ */
function initCursor() {
  if (!fine) return;
  document.body.classList.add('custom-cursor');
  const cur = $('.cursor'), label = $('.cursor__label');
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; cur.classList.remove('is-hidden'); });
  document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
  gsap.ticker.add(() => {
    x = lerp(x, tx, 0.18); y = lerp(y, ty, 0.18);
    cur.style.transform = `translate3d(${x}px,${y}px,0)`;
  });
  const set = (cls, txt) => { cur.className = 'cursor' + (cur.classList.contains('has-liquid') ? ' has-liquid' : '') + (cls ? ' ' + cls : ''); label.textContent = txt || ''; };
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor],a,button,.compare__box,.clay,input[type=range]');
    if (!t) return set('');
    if (t.dataset.cursor === 'view') return set('is-view', t.dataset.cursorLabel || 'View');
    if (t.classList.contains('compare__box')) return set('is-drag', '◂ ▸');
    if (t.classList.contains('clay')) return set('is-drag', 'Reveal');
    set('is-link');
  });
}

/* ============================================================
   Glass specular + magnetic
   ============================================================ */
function initGlassSheen() {
  if (!fine) return;
  document.addEventListener('mousemove', e => {
    const t = e.target.closest('.glass,.work');
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    t.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, { passive: true });
}
function initMagnetic(root = document) {
  if (!fine) return;
  $$('[data-magnetic]', root).forEach(el => {
    const strength = el.classList.contains('btn--lg') ? 0.35 : 0.25;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: .6, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1,.4)' }));
  });
}

/* ============================================================
   Nav
   ============================================================ */
function initNav() {
  const nav = $('.nav');
  let last = 0;
  lenis.on('scroll', ({ scroll, direction }) => {
    if (scroll > 200 && direction === 1 && scroll - last > 4) nav.classList.add('is-hidden');
    else if (direction === -1 || scroll < 200) nav.classList.remove('is-hidden');
    last = scroll;
  });
  $$('main section[id]').forEach(sec => ScrollTrigger.create({
    trigger: sec, start: 'top 45%', end: 'bottom 45%',
    onToggle: s => $$('.nav__links a').forEach(a => a.classList.toggle('is-active', s.isActive && a.getAttribute('href') === '#' + sec.id)),
  }));
  $('.nav__burger').addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    open ? lenis.stop() : lenis.start();
  });
}

/* ============================================================
   Text / reveal / counters / contact
   ============================================================ */
function initSplit() {
  $$('[data-split]').forEach(h => {
    h.innerHTML = h.innerHTML.trim().split(/\s+/).map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
    gsap.to($$('.w > span', h), { y: 0, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
}
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach(el => { if (!el.closest('.hero')) io.observe(el); });
}
function initCounters() {
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => {
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 2, ease: 'expo.out', onUpdate: () => el.textContent = Math.round(o.v).toLocaleString('en-US') + suf });
    } });
  });
}
function initContact() {
  gsap.to('.contact__title .line > span', { y: 0, duration: 1.4, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
}


/* ============================================================
   Lightbox (used by project pages)
   ============================================================ */
let lbImages = [], lbTitle = '', lbIndex = 0;
function openLightbox(images, title, i) {
  lbImages = images; lbTitle = title;
  const lb = $('#lightbox'), thumbs = $('#lightboxThumbs');
  if (!lb) return;
  thumbs.innerHTML = images.map((n, k) => `<img src="${IMG(n, true)}" alt="" data-i="${k}">`).join('');
  $$('img', thumbs).forEach(t => t.addEventListener('click', () => showLb(+t.dataset.i)));
  showLb(i, true);
  lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
  lenis && lenis.stop();
}
function showLb(i, first) {
  lbIndex = (i + lbImages.length) % lbImages.length;
  const img = $('.lightbox__img');
  const swap = () => {
    img.src = IMG(lbImages[lbIndex]); img.alt = `${lbTitle} — view ${lbIndex + 1}`;
    $('.lightbox__title').textContent = lbTitle;
    $('.lightbox__count').textContent = `${lbIndex + 1} / ${lbImages.length}`;
    $$('#lightboxThumbs img').forEach((t, k) => t.classList.toggle('is-on', k === lbIndex));
    $$('#lightboxThumbs img')[lbIndex]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    img.onload = () => gsap.to(img, { opacity: 1, scale: 1, duration: .5, ease: 'expo.out' });
  };
  if (first) { gsap.set(img, { opacity: 0, scale: .97 }); swap(); }
  else gsap.to(img, { opacity: 0, scale: .97, duration: .18, onComplete: swap });
  [1, -1].forEach(d => { const n = new Image(); n.src = IMG(lbImages[(lbIndex + d + lbImages.length) % lbImages.length]); });
}
function closeLightbox() {
  const lb = $('#lightbox');
  lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
  lenis && lenis.start();
}
function initLightbox() {
  if (!$('#lightbox')) return;
  $('.lightbox__close').addEventListener('click', closeLightbox);
  $('.lightbox__bg').addEventListener('click', closeLightbox);
  $('.lightbox__arrow--prev').addEventListener('click', () => showLb(lbIndex - 1));
  $('.lightbox__arrow--next').addEventListener('click', () => showLb(lbIndex + 1));
  addEventListener('keydown', e => {
    if (!$('#lightbox').classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
  });
  let sx = 0;
  $('.lightbox__figure').addEventListener('pointerdown', e => sx = e.clientX);
  $('.lightbox__figure').addEventListener('pointerup', e => { const d = e.clientX - sx; if (Math.abs(d) > 40) showLb(lbIndex + (d < 0 ? 1 : -1)); });
}
