/* Shot by Kissu: interactions.
   Every feature is progressive: without this file the page still reads,
   links open the MP4s, the FAQ opens and the form posts. */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reducedQuery.matches;

  // Easing and timing tokens, mirrored from css/site.css
  const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const EASE_IN = 'cubic-bezier(0.55, 0, 1, 0.45)';
  const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
  const DUR_SMALL = 240;
  const DUR_FILTER = 280;
  const DUR_OPEN = 380;
  const DUR_CLOSE = 260;

  const body = document.body;
  const header = $('.site-header');
  const hero = $('.hero');

  /* ---------- Hero: the one load moment, plus video control ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));

  const heroVideo = $('.hero__video');
  const pauseBtn = $('.hero__pause');
  let heroPausedByUser = false;

  const playHero = () => heroVideo.play().catch(() => {});
  const setPauseLabel = () => {
    pauseBtn.textContent = heroVideo.paused ? 'Play video' : 'Pause video';
  };

  if (heroVideo && !reduced()) {
    playHero();
    pauseBtn.hidden = false;
  } else if (heroVideo) {
    pauseBtn.hidden = false;
    setPauseLabel();
  }
  heroVideo.addEventListener('play', setPauseLabel);
  heroVideo.addEventListener('pause', setPauseLabel);
  pauseBtn.addEventListener('click', () => {
    if (heroVideo.paused) { heroPausedByUser = false; playHero(); }
    else { heroPausedByUser = true; heroVideo.pause(); }
  });

  /* ---------- Header: transparent over the hero, solid after ---------- */
  if ('IntersectionObserver' in window) {
    const headerHeight = header.offsetHeight;
    const heroObserver = new IntersectionObserver(([entry]) => {
      header.dataset.overHero = String(entry.isIntersecting);
      // Stop decoding video nobody can see
      if (!entry.isIntersecting) heroVideo.pause();
      else if (!heroPausedByUser && !reduced()) playHero();
    }, { rootMargin: `-${headerHeight}px 0px 0px 0px` });
    heroObserver.observe(hero);
  }

  /* ---------- Mobile menu ---------- */
  const menu = $('#menu');
  const menuBtn = $('.menu-button');
  const menuFocusables = () => [menuBtn, ...$$('a, button', menu)];

  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open', 'is-locked');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    $('a', menu).focus();
  }
  function closeMenu({ returnFocus = true } = {}) {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open', 'is-locked');
    setTimeout(() => { menu.hidden = true; }, reduced() ? 0 : DUR_SMALL);
    if (returnFocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => closeMenu({ returnFocus: false })));
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const items = menuFocusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) closeMenu({ returnFocus: false }); });

  /* ---------- Poster skeletons ---------- */
  $$('.reel__media img').forEach((img) => {
    const done = () => { img.classList.add('is-loaded'); img.parentElement.classList.add('is-loaded'); };
    if (img.complete && img.naturalWidth) done();
    else img.addEventListener('load', done, { once: true });
  });

  /* ---------- Work filter (FLIP so reels slide into place) ---------- */
  const reelList = $('#reels');
  const reelItems = $$('.reels__item');
  const filterBtns = $$('.filter');
  const workStatus = $('.work__status');
  const filterNames = { all: 'all work', love: 'love stories', brand: 'brand shoots', event: 'events' };

  function applyFilter(cat) {
    const before = new Map(reelItems.filter((i) => !i.hidden).map((i) => [i, i.getBoundingClientRect()]));
    reelItems.forEach((i) => { i.hidden = !(cat === 'all' || i.dataset.cat === cat); });
    reelList.scrollTo({ left: 0 });

    const shown = reelItems.filter((i) => !i.hidden);
    workStatus.textContent = `Showing ${shown.length} ${filterNames[cat]}`;
    if (reduced()) return;

    shown.forEach((item) => {
      const first = before.get(item);
      if (!first) {
        item.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }],
          { duration: DUR_FILTER, easing: EASE_OUT });
        return;
      }
      const last = item.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (dx || dy) {
        item.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
          { duration: DUR_FILTER, easing: EASE_IN_OUT });
      }
    });
  }
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    applyFilter(btn.dataset.filter);
  }));

  /* ---------- Reel player (grows out of the tapped frame) ---------- */
  const player = $('.player');
  const frame = $('.player__frame');
  const playerVideo = $('.player__video');
  const playerTitle = $('.player__title');
  let trigger = null;   // element to return focus to
  let origin = null;    // frame the player grows from, when visible

  const visible = (el) => {
    if (!el || el.closest('[hidden]')) return null;
    const r = el.getBoundingClientRect();
    return r.width && r.bottom > 0 && r.top < innerHeight ? r : null;
  };
  const flipFrom = (from) => {
    const to = frame.getBoundingClientRect();
    return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  };

  function openReel(slug, from) {
    const link = $(`.reel[data-reel="${slug}"]`);
    if (!link) return;
    trigger = from;
    origin = from.classList.contains('reel') ? $('.reel__media', from) : null;

    playerTitle.textContent = link.dataset.title;
    playerVideo.src = link.getAttribute('href');
    playerVideo.poster = $('img', link).getAttribute('src');

    player.showModal();
    body.classList.add('is-locked');
    playerVideo.play().catch(() => {});

    if (reduced()) return;
    const rect = visible(origin);
    player.classList.add('is-animating');
    const anim = rect
      ? frame.animate([{ transform: flipFrom(rect) }, { transform: 'none' }], { duration: DUR_OPEN, easing: EASE_OUT })
      : frame.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: DUR_OPEN, easing: EASE_OUT });
    anim.finished.then(() => player.classList.remove('is-animating')).catch(() => {});
  }

  let closing = false;
  async function closeReel() {
    if (closing || !player.open) return;
    closing = true;
    playerVideo.pause();

    if (!reduced()) {
      const rect = visible(origin);
      player.classList.add('is-animating', 'is-closing');
      const anim = rect
        ? frame.animate([{ transform: 'none' }, { transform: flipFrom(rect) }], { duration: DUR_CLOSE, easing: EASE_IN, fill: 'forwards' })
        : frame.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(0.96)' }], { duration: DUR_CLOSE, easing: EASE_IN, fill: 'forwards' });
      await anim.finished.catch(() => {});
      anim.cancel();
      player.classList.remove('is-animating', 'is-closing');
    }

    player.close();
    playerVideo.removeAttribute('src');
    playerVideo.load();
    body.classList.remove('is-locked');
    if (trigger) trigger.focus();
    closing = false;
  }

  $$('.reel').forEach((link) => link.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openReel(link.dataset.reel, link);
  }));
  $$('[data-open-reel]').forEach((btn) => btn.addEventListener('click', () => openReel(btn.dataset.openReel, btn)));
  $('.player__close').addEventListener('click', closeReel);
  player.addEventListener('cancel', (e) => { e.preventDefault(); closeReel(); });
  player.addEventListener('click', (e) => { if (e.target === player) closeReel(); });

  /* ---------- Love stories: "Learn more" ---------- */
  $$('.service__toggle').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Show less' : 'Learn more';
      panel.hidden = !open;
      panel.classList.toggle('is-open', open);
    });
  });

  /* ---------- Copy email ---------- */
  $$('.copy-email').forEach((btn) => {
    const status = btn.parentElement.querySelector('.copy-email__status');
    let timer;
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        status.textContent = 'Copied';
        clearTimeout(timer);
        timer = setTimeout(() => { status.textContent = ''; }, 1600);
      } catch {
        location.href = `mailto:${email}`;
      }
    });
  });

  /* ---------- Inquiry form ---------- */
  const form = $('#inquiry-form');
  const submitBtn = $('button[type="submit"]', form);
  const formStatus = $('.form__status', form);
  const serviceSelect = $('#f-service');

  // "Inquire" from a service pre-selects that service
  $$('[data-service]').forEach((a) => a.addEventListener('click', () => { serviceSelect.value = a.dataset.service; }));

  const messages = {
    name: { valueMissing: 'Enter your name so I know who I’m talking to.' },
    email: { valueMissing: 'Enter your email address.', typeMismatch: 'Enter an email address like name@example.com.' },
    service: { valueMissing: 'Choose what we’re shooting.' },
    date: { valueMissing: 'Pick a date, or your best guess.' },
    message: { valueMissing: 'Tell me a little about your vision.' },
  };

  function validate(field) {
    const error = document.getElementById(`${field.id}-error`);
    if (!error) return true;
    const { validity } = field;
    const text = validity.valid ? '' : (validity.typeMismatch ? messages[field.name].typeMismatch : messages[field.name].valueMissing);
    error.textContent = text;
    field.setAttribute('aria-invalid', String(!validity.valid));
    return validity.valid;
  }

  const required = $$('[required]', form);
  required.forEach((field) => {
    field.addEventListener('blur', () => validate(field));
    // Once flagged, clear the error as soon as it is fixed
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
  });

  function setSubmit(state) {
    submitBtn.textContent = submitBtn.dataset[`label${state[0].toUpperCase()}${state.slice(1)}`];
    submitBtn.setAttribute('aria-disabled', String(state !== 'idle'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn.getAttribute('aria-disabled') === 'true') return;

    const invalid = required.filter((f) => !validate(f));
    if (invalid.length) { invalid[0].focus(); return; }

    setSubmit('busy');
    formStatus.textContent = '';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      const first = $('#f-name').value.trim().split(' ')[0];
      setSubmit('done');
      formStatus.textContent = `Thanks, ${first}. I’ll be in touch within 24 hours.`;
      form.reset();
    } catch {
      setSubmit('idle');
      formStatus.textContent = 'Your inquiry didn’t send. Check your connection and try again, or email hello@shotbykissu.com.';
    }
  });

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
