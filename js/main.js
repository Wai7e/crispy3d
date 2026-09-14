/* ============================================================
   CRISPY — index page (shared code in common.js, content in data.js)
   ============================================================ */
/* ============================================================
   Preloader → hero intro
   ============================================================ */
function initPreloader() {
  const pre = $('.preloader'), num = $('.preloader__count span'), bar = $('.preloader__bar i');
  const hero = new Image(); hero.src = IMG(HERO_IMG);
  const heroLoaded = new Promise(res => { hero.onload = res; hero.onerror = res; setTimeout(res, 3500); });
  const o = { v: 0 };
  const tl = gsap.timeline();
  tl.to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(o.v); bar.style.width = o.v + '%'; } });
  const done = () => {
    gsap.timeline()
      .to('.preloader__inner', { y: -40, opacity: 0, duration: .5, ease: 'power3.in' })
      .to(pre, { yPercent: -100, duration: .9, ease: 'expo.inOut' }, '-=.1')
      .set(pre, { display: 'none' })
      .add(heroIntro, '-=.55');
  };
  Promise.all([heroLoaded, new Promise(r => tl.eventCallback('onComplete', r))]).then(done);
}
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.hero__bg', { scale: 1.08 }, { scale: 1, duration: 2.6 }, 0)
    .to('.hero__title .line > span', { y: 0, duration: 1.4, stagger: .12 }, .1)
    .fromTo('.nav', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, .4)
    .add(() => $$('.hero [data-reveal]').forEach((el, i) => setTimeout(() => el.classList.add('is-in'), i * 120)), .5)
    .add(() => heroGL && heroGL.burst(), 0);
}

/* ============================================================
   WebGL hero — a wall of glass panes over the render (three.js)
   Panes tilt toward the cursor, refract the image and catch a highlight.
   ============================================================ */
let heroGL = null;
function initHeroGL() {
  const canvas = $('.hero__gl'), img = $('.hero__img');
  if (!canvas || !window.THREE || reduced) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

  const uniforms = {
    uTex: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uImg: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(.5, .5) }, uIntro: { value: 0 }, uScroll: { value: 0 },
  };
  const frag = `
    precision highp float;
    uniform sampler2D uTex; uniform vec2 uRes, uImg, uMouse; uniform float uTime, uIntro, uScroll;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec2 cover(vec2 uv){
      float ra = uRes.x/uRes.y, ia = uImg.x/uImg.y; vec2 s = vec2(1.0);
      if (ra > ia) s.y = ia/ra; else s.x = ra/ia;
      return (uv - .5) * s + .5;
    }
    void main(){
      vec2 uv = vUv; float asp = uRes.x/uRes.y;
      float cols = 9.0; vec2 grid = vec2(cols, floor(cols / asp + .5));
      vec2 id = floor(uv * grid);
      vec2 c = (id + .5) / grid;                 // pane centre
      vec2 local = fract(uv * grid) - .5;        // -0.5..0.5 inside pane
      float rnd = hash(id);

      // intro: panes settle from a random tilt, centre first
      float dc = length((c - .5) * vec2(asp, 1.0));
      float t = clamp((uIntro * 1.6 - dc * 0.9 - rnd * 0.25), 0.0, 1.0);
      t = 1.0 - pow(1.0 - t, 3.0);
      vec2 chaos = (vec2(hash(id + 1.7), hash(id + 3.1)) - .5) * 1.4 * (1.0 - t);

      // cursor influence: nearer panes tilt more, plus a slow travelling wave
      vec2 dm = (uMouse - c) * vec2(asp, 1.0); float dist = length(dm);
      float infl = smoothstep(0.75, 0.0, dist);
      vec2 tilt = normalize(dm + 1e-5) * infl * 0.55 + chaos;
      tilt += vec2(sin(uTime * .6 + id.x * .9 + id.y * .4), cos(uTime * .5 + id.y * .8)) * 0.05;
      tilt += (uv - .5) * uScroll * 0.6;

      // refraction through the pane: whole-pane offset + slight lensing inside the pane
      vec2 off = tilt * 0.035 + local * (length(tilt) * 0.05);
      vec2 cuv = cover(uv + off);
      vec3 col = texture2D(uTex, cuv).rgb;

      // pane edge: rounded rectangle SDF → thin gap + bevel
      vec2 q = abs(local) - vec2(0.5 - 0.06);
      float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.06;   // 0 at pane border, <0 inside
      float gap = smoothstep(-0.012, 0.0, sd);            // dark gap between panes
      float bevel = smoothstep(-0.11, -0.012, sd);        // brighter rim toward the edge
      col *= 1.0 - gap * 0.55;
      col += (1.0 - bevel) * 0.06;

      // specular highlight from a light at the top-left, shaped by tilt
      vec3 n = normalize(vec3(-tilt * 0.9, 1.0));
      vec3 l = normalize(vec3(-0.35, 0.6, 0.72));
      float spec = pow(max(dot(n, l), 0.0), 26.0);
      col += spec * 0.28 * vec3(1.0, 0.96, 0.9);
      // soft glow on panes under the cursor
      col += infl * infl * 0.05;

      // intro fade + vignette
      col *= mix(0.0, 1.0, t);
      float v = smoothstep(1.3, 0.35, length((uv - .5) * vec2(1.1, 1.0)));
      col *= mix(0.6, 1.0, v);
      gl_FragColor = vec4(col, 1.0);
    }`;
  const vert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;
  const scene = new THREE.Scene(), cam = new THREE.Camera();
  scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag })));

  const resize = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); uniforms.uRes.value.set(w, h);
  };
  new THREE.TextureLoader().load(IMG(HERO_IMG), t => {
    t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
    uniforms.uImg.value.set(t.image.width, t.image.height); uniforms.uTex.value = t;
    canvas.classList.add('is-ready'); img.classList.add('is-gl');
    if (new URLSearchParams(location.search).has('shot')) uniforms.uIntro.value = 1;
  });
  resize(); addEventListener('resize', resize);

  const tm = { x: .5, y: .5 };
  const onMove = (cx, cy) => { const r = canvas.getBoundingClientRect(); tm.x = (cx - r.left) / r.width; tm.y = 1 - (cy - r.top) / r.height; };
  addEventListener('mousemove', e => onMove(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', e => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

  let visible = true, introT = -1;
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(canvas);
  gsap.ticker.add((t) => {
    if (!visible) return;
    uniforms.uTime.value = t;
    uniforms.uMouse.value.x = lerp(uniforms.uMouse.value.x, tm.x, .07);
    uniforms.uMouse.value.y = lerp(uniforms.uMouse.value.y, tm.y, .07);
    if (introT >= 0) uniforms.uIntro.value = Math.min(1, (t - introT) / 2.2);
    uniforms.uScroll.value = Math.min(1, scrollY / innerHeight);
    renderer.render(scene, cam);
  });
  heroGL = { burst: () => { introT = uniforms.uTime.value; } };
}

/* ============================================================
   Hero parallax + misc
   ============================================================ */
function initFluid() {
  const sec = $('#fluid'), v = $('.fluid__video'); if (!sec) return;
  new IntersectionObserver(es => es[0].isIntersecting ? v.play().catch(() => {}) : v.pause(), { rootMargin: '200px' }).observe(sec);
  gsap.to('.fluid__media', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.to('.fluid__title .line > span', { y: 0, duration: 1.4, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 65%' } });
}
function initHero() {
  gsap.to('.hero__content', { yPercent: 18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__bg', { yPercent: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  const t = $('#localTime');
  const tick = () => t.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tbilisi' });
  tick(); setInterval(tick, 15000);
  $('#year').textContent = new Date().getFullYear();
}

/* ============================================================
   Works grid — hover-scrub + tilt → project page
   ============================================================ */
function buildWorks() {
  const grid = $('#worksGrid');
  PROJECTS.forEach((p, idx) => {
    const el = document.createElement('a');
    el.href = `project.html?id=${p.id}`;
    el.className = 'work ' + p.size.split(' ').map(s => 'work--' + s).join(' ');
    el.dataset.cursor = 'view'; el.dataset.cursorLabel = 'Open';
    const media = [...p.images.map(n => ({ img: n })), ...(p.videos || [])];
    el.innerHTML = `
      <div class="work__media">
        ${media.map((x, i) => x.img
          ? `<img src="${IMG(x.img, true)}" alt="${p.title} — view ${i + 1}" ${i === 0 ? 'class="is-on"' : 'loading="lazy"'}>`
          : `<video src="${x.src}" poster="${x.poster}" muted loop playsinline preload="none"${i === 0 ? ' class="is-on"' : ''}></video>`).join('')}
        <div class="work__scrub">${media.map((_, i) => `<i${i === 0 ? ' class="is-on"' : ''}></i>`).join('')}</div>
        <div class="work__veil"></div>
      </div>
      <div class="work__info">
        <div>
          <h3 class="work__title">${p.title}</h3>
          <div class="work__meta">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        </div>
        <span class="work__count">${String(media.length).padStart(2, '0')} views</span>
      </div>
      <div class="work__glow"></div>`;
    grid.appendChild(el);

    const imgs = $$('.work__media img, .work__media video', el), dots = $$('.work__scrub i', el);
    let cur = 0;
    const show = i => {
      if (i === cur) return;
      imgs[cur].classList.remove('is-on'); dots[cur].classList.remove('is-on');
      if (imgs[cur].tagName === 'VIDEO') imgs[cur].pause();
      cur = i; imgs[cur].classList.add('is-on'); dots[cur].classList.add('is-on');
      if (imgs[cur].tagName === 'VIDEO') imgs[cur].play().catch(() => {});
    };
    if (fine) {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        show(clamp(Math.floor(px * imgs.length), 0, imgs.length - 1));
        if (!reduced) gsap.to(el, { rotateY: (px - .5) * 6, rotateX: (.5 - py) * 6, transformPerspective: 1200, duration: .8, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => { gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1.2, ease: 'elastic.out(1,.5)' }); show(0); });
    }
    // page transition: fade out, then navigate
    el.addEventListener('click', e => {
      e.preventDefault();
      gsap.to('main, .nav, footer', { opacity: 0, y: -20, duration: .45, ease: 'power2.in', onComplete: () => location.href = el.href });
    });
  });
  gsap.utils.toArray('.work').forEach((el, i) => {
    gsap.fromTo(el, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', delay: (i % 2) * .1,
      scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
}

/* ============================================================
   Compare sliders (generic) + Day / Night pair switch
   ============================================================ */
function setupCompare(box) {
  const night = $('.compare__night', box), handle = $('.compare__handle', box);
  let pos = .5, target = .5, dragging = false;
  gsap.ticker.add(() => {
    pos = lerp(pos, target, .18);
    night.style.clipPath = `inset(0 0 0 ${pos * 100}%)`;
    handle.style.left = `${pos * 100}%`;
  });
  const setFrom = e => { const r = box.getBoundingClientRect(); target = clamp((e.clientX - r.left) / r.width, 0, 1); };
  box.addEventListener('pointerdown', e => { dragging = true; box.setPointerCapture(e.pointerId); setFrom(e); });
  box.addEventListener('pointermove', e => { if (dragging || (fine && e.buttons === 0 && box.matches(':hover') && !reduced)) setFrom(e); });
  box.addEventListener('pointerup', () => dragging = false);
  box.addEventListener('pointercancel', () => dragging = false);
  ScrollTrigger.create({ trigger: box, start: 'top 70%', once: true, onEnter: () => {
    gsap.to({ v: .5 }, { v: .2, duration: 1.2, ease: 'power2.inOut', onUpdate() { target = this.targets()[0].v; },
      onComplete() { gsap.to({ v: .2 }, { v: .5, duration: 1.2, ease: 'power2.inOut', onUpdate() { target = this.targets()[0].v; } }); } });
  } });
  return {
    swap(a, b) {
      gsap.to(box, { opacity: 0, scale: .985, duration: .3, ease: 'power2.in', onComplete: () => {
        $('.compare__img--day', box).src = IMG(a); $('.compare__night img', box).src = IMG(b);
        gsap.to(box, { opacity: 1, scale: 1, duration: .6, ease: 'expo.out' });
      } });
    },
  };
}
function initCompare() {
  const main = setupCompare($('#compareBox'));
  const sw = $('#lightSwitch');
  LIGHT_PAIRS.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'chip glass' + (i === 0 ? ' is-active' : ''); b.textContent = p.label;
    b.addEventListener('click', () => {
      if (b.classList.contains('is-active')) return;
      $$('.chip', sw).forEach(c => c.classList.remove('is-active')); b.classList.add('is-active');
      main.swap(p.day, p.night);
    });
    sw.appendChild(b);
  });
  $$('[data-compare]').forEach(setupCompare);
}

/* ============================================================
   Process: technical steps + nozzle turntable
   ============================================================ */
function initProcess() {
  const steps = $('#blueprintSteps');
  if (steps) {
    steps.innerHTML = PROCESS.steps.map((s, i) => `
      <figure class="step glass" data-reveal style="transition-delay:${i * .12}s">
        <div class="step__media"><img src="${IMG(s.img, true)}" alt="${s.label}" loading="lazy"></div>
        <figcaption><em>0${i + 1}</em><b>${s.label}</b><span>${s.note}</span></figcaption>
      </figure>`).join('');
  }
  const nz = $('.nozzle__video');
  if (nz) new IntersectionObserver(es => es[0].isIntersecting ? nz.play().catch(() => {}) : nz.pause(), { rootMargin: '150px' }).observe(nz);
}

/* ============================================================
   Quote calculator
   ============================================================ */
function initQuote() {
  const panel = $('#quotePanel'); if (!panel) return;
  const typeSeg = $('#qType');
  Object.entries(PRICING.types).forEach(([k, v], i) => {
    const b = document.createElement('button'); b.dataset.v = k; b.textContent = v.label; if (i === 0) b.classList.add('is-active');
    typeSeg.appendChild(b);
  });
  const state = { type: Object.keys(PRICING.types)[0], views: 4, light: 1, res: '2K', anim: false, file: false, rush: false };
  const priceEl = $('#qPrice'), rangeEl = $('#qRange'), noteEl = $('#qNote'), sumEl = $('#qSummary');
  const shown = { v: 0 };
  const fmt = n => PRICING.currency + Math.round(n).toLocaleString('en-US');

  const calc = () => {
    const t = PRICING.types[state.type];
    let views = state.views, cost;
    if (t.flat) { cost = t.flat; views = 1; }
    else {
      cost = Math.max(t.min, t.perView * views);
      cost *= 1 + (state.light - 1) * PRICING.lightingScenario;
      cost *= PRICING.resolution[state.res];
    }
    if (state.anim) cost += PRICING.animation;
    if (state.file) cost *= 1 + PRICING.editableFile;
    if (state.rush) cost *= PRICING.rush;
    return { cost, t, views };
  };
  const render = () => {
    const { cost, t, views } = calc();
    gsap.to(shown, { v: cost, duration: .7, ease: 'expo.out', onUpdate: () => priceEl.textContent = fmt(shown.v) });
    const lo = cost * (1 - PRICING.rangeSpread), hi = cost * (1 + PRICING.rangeSpread);
    rangeEl.textContent = `Typical range ${fmt(lo)} – ${fmt(hi)}`;
    noteEl.textContent = t.note || '';
    const lines = [t.label + (t.flat ? '' : ` × ${views} view${views > 1 ? 's' : ''}`)];
    if (!t.flat) { lines.push(`${state.light} lighting scenario${state.light > 1 ? 's' : ''}`); lines.push(`${state.res} resolution`); }
    if (state.anim) lines.push('10 s flythrough');
    if (state.file) lines.push('Editable Blender file');
    if (state.rush) lines.push('48-hour rush');
    sumEl.innerHTML = lines.map(l => `<li>${l}</li>`).join('');
    const body = `Hi Boris,%0A%0AI'd like a quote for:%0A- ${lines.join('%0A- ')}%0A%0AEstimated on your site: ${fmt(cost)} (${fmt(lo)} – ${fmt(hi)})%0A%0AProject details:%0A`;
    $('#qSend').href = `mailto:wvreprod@gmail.com?subject=${encodeURIComponent('Quote request — ' + t.label)}&body=${body}`;
    panel.classList.toggle('is-flat', !!t.flat);
  };
  const seg = (el, key) => el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', el).forEach(x => x.classList.remove('is-active')); b.classList.add('is-active');
    state[key] = b.dataset.v; render();
  });
  seg(typeSeg, 'type'); seg($('#qRes'), 'res');
  const range = (id, key, out) => { const el = $(id); const upd = () => { state[key] = +el.value; $(out).textContent = el.value; el.style.setProperty('--p', `${(el.value - el.min) / (el.max - el.min) * 100}%`); render(); }; el.addEventListener('input', upd); upd(); };
  range('#qViews', 'views', '#qViewsOut'); range('#qLight', 'light', '#qLightOut');
  [['#qAnim', 'anim'], ['#qFile', 'file'], ['#qRush', 'rush']].forEach(([id, k]) => $(id).addEventListener('change', e => { state[k] = e.target.checked; render(); }));
  render();
}

/* ============================================================
   Boot
   ============================================================ */
initScroll();
initLiquid();
initCursor();
initGlassSheen();
initHero();
initHeroGL();
initFluid();
initNav();
buildWorks();
initCompare();
initProcess();
initQuote();
initSplit();
initReveal();
initCounters();
initContact();
initMagnetic();
const shot = new URLSearchParams(location.search).get('shot');
if (shot === null) initPreloader();
else {
  // dev: ?shot=<scrollY> — skip preloader, reveal everything, jump to Y
  $('.preloader').style.display = 'none';
  gsap.set('.hero__title .line > span, .contact__title .line > span, .fluid__title .line > span', { y: 0 });
  $$('[data-reveal]').forEach(el => el.classList.add('is-in'));
  setTimeout(() => {
    lenis.destroy(); document.body.style.marginTop = -shot + 'px'; ScrollTrigger.refresh();
    ScrollTrigger.getAll().forEach(t => { if (t.animation && !t.vars.scrub) t.animation.progress(1); });
    $$('[data-count]').forEach(el => el.textContent = (+el.dataset.count).toLocaleString('en-US') + (el.dataset.suffix || ''));
  }, 400);
}
addEventListener('load', () => ScrollTrigger.refresh());
