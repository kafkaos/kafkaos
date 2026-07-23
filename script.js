/* ============================================================
   Franz Kafka Porto Domingos — comportamento compartilhado
   ============================================================ */

/* ---- Relógio na barra de título ---------------------------- */
function startClock() {
  const el = document.querySelector('.clock');
  if (!el) return;
  const tick = () => {
    const d = new Date();
    const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    el.textContent = `${dias[d.getDay()]} · ${hh}:${mm}`;
  };
  tick();
  setInterval(tick, 15000);
}

/* ---- Lightbox de vídeo (usado só pela entrevista, no Início) */
function buildVideoLightbox() {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="box" role="dialog" aria-modal="true">
      <button class="close" aria-label="Fechar">&times;</button>
      <div class="lb-media"></div>
      <div class="lb-bar"><span class="tt"></span></div>
    </div>`;
  document.body.appendChild(lb);

  const media = lb.querySelector('.lb-media');
  const title = lb.querySelector('.tt');

  function close() {
    lb.classList.remove('open');
    media.innerHTML = '';                 /* para o vídeo ao fechar */
    document.body.style.overflow = '';
  }
  function open() {
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  lb.querySelector('.close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  return {
    video(id, label) {
      media.innerHTML =
        `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
                 title="${label}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      title.textContent = label;
      open();
    }
  };
}

/* ---- Entrevista (página Início) --------------------------- */
function initInterview() {
  const thumbs = document.querySelectorAll('.thumb[data-video]');
  if (!thumbs.length) return;
  const lightbox = buildVideoLightbox();
  thumbs.forEach((t) => {
    const go = () => lightbox.video(t.dataset.video, t.dataset.label);
    t.addEventListener('click', go);
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
}

/* ============================================================
   Galeria com paginação — acesso direto, sem janela
   Cada item é um link real (<a href>). O clique já leva direto
   ao destino (download ou jogo), em nova aba.
   opts: { badgeLabel, badgeIcon, badgeClass }
   ============================================================ */
function initGallery(items, perPage, opts) {
  const grid = document.querySelector('.gallery');
  const pager = document.querySelector('.pager');
  if (!grid) return;
  perPage = perPage || 8;
  let page = 0;
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  opts = opts || {};

  const iconFallback = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="3" y="4" width="18" height="14" rx="2"/><circle cx="8.5" cy="9" r="1.5"/>
    <path d="M4 16l4-4 3 2.5 3.5-3L20 16"/></svg>`;

  function renderGrid() {
    grid.innerHTML = '';
    items.slice(page * perPage, page * perPage + perPage).forEach((it) => {
      const tile = document.createElement('a');
      tile.className = 'tile';
      tile.href = it.url || '#';
      tile.target = '_blank';
      tile.rel = 'noopener';
      tile.innerHTML =
        `<div class="art"${it.img ? ` style="background-image:url('${it.img}');background-size:cover;background-position:center;"` : ''}>
           ${opts.badgeLabel ? `<span class="badge ${opts.badgeClass || ''}">${opts.badgeIcon || ''}${opts.badgeLabel}</span>` : ''}
           ${it.img ? '' : iconFallback}
         </div>
         <div class="meta">${it.title ? `<div class="tt">${it.title}</div>` : ''}<div class="st">${it.sub || ''}</div></div>`;
      grid.appendChild(tile);
    });
  }

  function renderPager() {
    if (!pager) return;
    pager.innerHTML = '';
    if (pages < 2) return;
    const mk = (label, o = {}) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = label;
      if (o.active) b.classList.add('active');
      if (o.disabled) b.disabled = true;
      if (o.onClick) b.addEventListener('click', o.onClick);
      pager.appendChild(b);
    };
    mk('&laquo;', { disabled: page === 0, onClick: () => go(page - 1) });
    for (let i = 0; i < pages; i++) mk(String(i + 1), { active: i === page, onClick: () => go(i) });
    mk('&raquo;', { disabled: page === pages - 1, onClick: () => go(page + 1) });
  }

  function go(p) { page = Math.max(0, Math.min(pages - 1, p)); renderGrid(); renderPager(); window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' }); }
  go(0);
}

document.addEventListener('DOMContentLoaded', () => {
  startClock();
  initInterview();
});
