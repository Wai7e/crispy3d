/* ============================================================
   Project page — horizontal gallery with parallax
   ============================================================ */
const id = new URLSearchParams(location.search).get('id');
const idx = Math.max(0, PROJECTS.findIndex(p => p.id === id));
const P = PROJECTS[idx];
const NEXT = PROJECTS[(idx + 1) % PROJECTS.length];

document.title = `${P.title} — Boris K`;
$('#ppHero').src = IMG(P.images[0]);
$('#ppHero').alt = P.title;
$('#ppTitle').textContent = P.title;
$('#ppTags').innerHTML = P.tags.map(t => `<span class="chip glass">${t}</span>`).join('');
$('#ppMeta').innerHTML = [
  ['Year', P.year], ['Client', P.client], ['Tools', P.tools.join(' · ')], ['Views', String(P.images.length + (P.videos || []).length).padStart(2, '0')],
].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
$('#ppBrief').textContent = P.brief;
$('#ppResult').textContent = P.result;
$('#ppDeliv').innerHTML = (P.deliverables || []).map(d => `<span class="chip glass">${d}</span>`).join('');
$('#ppNextLink').href = `project.html?id=${NEXT.id}`;
$('#ppNextLink').innerHTML = NEXT.title.replace(/(\S+)$/, '<em>$1</em>');
$('#ppNextImg').src = IMG(NEXT.images[0], true);
$('#year').textContent = new Date().getFullYear();

// gallery frames
const track = $('#ppTrack');
const MEDIA = [...(P.videos || []), ...P.images.map(n => ({ img: n }))];
track.innerHTML = MEDIA.map((x, i) => `
  <figure class="pp__frame" ${x.img ? `data-cursor="view" data-img="${P.images.indexOf(x.img)}"` : ''}>
    ${x.img ? `<img src="${IMG(x.img)}" alt="${P.title} — view ${i + 1}" ${i > 1 ? 'loading="lazy"' : ''}>`
            : `<video src="${x.src}" poster="${x.poster}" muted loop playsinline autoplay preload="metadata"></video>`}
    <span>${x.label || `${String(i + 1).padStart(2, '0')} / ${String(MEDIA.length).padStart(2, '0')}`}</span>
  </figure>`).join('');
$$('.pp__frame[data-img]', track).forEach(f => f.addEventListener('click', () => openLightbox(P.images, P.title, +f.dataset.img)));

initScroll();
initLiquid();
initCursor();
initGlassSheen();
initNav();
initReveal();
initLightbox();
initMagnetic();

// intro
gsap.timeline({ defaults: { ease: 'expo.out' } })
  .fromTo('#ppHero', { scale: 1.2, filter: 'brightness(.4)' }, { scale: 1.08, filter: 'brightness(1)', duration: 2 }, 0)
  .to('.pp__title .line > span', { y: 0, duration: 1.3 }, .2)
  .fromTo('.pp__back, .pp__tags, .pp__meta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .1 }, .4)
  .fromTo('.nav', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, .5);
gsap.to('#ppHero', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.pp__hero', start: 'top top', end: 'bottom top', scrub: true } });

// horizontal gallery (desktop) / vertical stack (narrow screens)
function buildGallery() {
  const pin = $('#ppPin');
  if (innerWidth < 900) {
    pin.classList.add('pp__stack'); pin.classList.remove('pp__pin');
    $('.pp__progress').remove(); $('.pp__hint').remove();
    gsap.utils.toArray('.pp__frame').forEach(f => gsap.fromTo(f, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%' } }));
    return;
  }
  const imgs = $$('.pp__frame img, .pp__frame video', track);
  const dist = () => track.scrollWidth - innerWidth;
  gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '#ppGallery', pin: true, scrub: 1, start: 'top top', end: () => '+=' + (dist() + innerHeight * .4), invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: st => {
        $('#ppProg').style.width = (st.progress * 100) + '%';
        // parallax: each image slides inside its frame relative to viewport centre
        imgs.forEach(img => {
          const r = img.parentElement.getBoundingClientRect();
          const c = (r.left + r.width / 2 - innerWidth / 2) / innerWidth; // -1..1
          img.style.transform = `translateX(${c * -6}%) scale(1.12)`;
        });
      },
    },
  });
  gsap.fromTo('.pp__frame', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '#ppGallery', start: 'top 80%' } });
}
addEventListener('load', () => { buildGallery(); ScrollTrigger.refresh(); });

// next-project transition
$('#ppNextLink').addEventListener('click', e => {
  e.preventDefault();
  const href = e.currentTarget.href;
  gsap.to('main, .nav, footer', { opacity: 0, y: -20, duration: .45, ease: 'power2.in', onComplete: () => location.href = href });
});
// restore if the page comes back from bfcache with the fade-out still applied
addEventListener('pageshow', e => { if (e.persisted) gsap.set('main, .nav, footer', { opacity: 1, y: 0 }); });
