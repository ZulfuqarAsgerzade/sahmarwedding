(function () {
  'use strict';
  const C = window.INVITE;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- tarix hesabları ---------- */
  const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
  const WEEKDAYS = ['bazar', 'bazar ertəsi', 'çərşənbə axşamı', 'çərşənbə', 'cümə axşamı', 'cümə', 'şənbə'];
  const [Y, M, D] = C.date.split('-').map(Number);
  const target = new Date(`${C.date}T${C.time}:00${C.utcOffset}`);
  const pad = n => String(n).padStart(2, '0');
  // həftənin günü (tarixə görə, brauzerin saat qurşağından asılı olmayaraq)
  const dow = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
  const initial = s => (s.trim()[0] || '').toLocaleUpperCase('az');

  /* ---------- mətnlərin yerləşdirilməsi ---------- */
  const bind = {
    groom: C.groom, bride: C.bride,
    groomInitial: initial(C.groom), brideInitial: initial(C.bride),
    hashtag: C.hashtag,
    eventTitleLong: 'Nişan mərasiminə dəvət',
    dateNumeric: `${pad(D)} · ${pad(M)} · ${Y}`,
    dayNum: pad(D), monthName: MONTHS[M - 1], year: String(Y),
    weekday: WEEKDAYS[dow], time: C.time,
    dateShort: `${D} ${MONTHS[M - 1]} ${Y}`,
    venueName: C.venue.name, venueAddress: C.venue.address, venueNote: C.venue.note,
    rsvpBy: C.rsvpBy,
    dressStyle: C.dress.style, dressText: C.dress.text,
    dressWomen: C.dress.women, dressMen: C.dress.men, dressAvoid: C.dress.avoid
  };
  $$('[data-bind]').forEach(el => { const v = bind[el.dataset.bind]; if (v != null) el.textContent = v; });
  document.title = `${C.groom} & ${C.bride} · Nişan dəvətnaməsi`;

  /* hero adı: hərf-hərf */
  function letters(el, text, start) {
    el.innerHTML = '';
    Array.from(text).forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = ch; s.style.setProperty('--i', start + i);
      el.appendChild(s);
    });
    return start + text.length;
  }
  let idx = letters($('#nm-groom'), C.groom, 0);
  idx = letters($('#nm-bride'), C.bride, idx + 2);
  $('.hero-names').setAttribute('aria-label', `${C.groom} və ${C.bride}`);

  /* ---------- açılış dərvazası ---------- */
  const gate = $('#gate');
  let startMusic = function () {};
  function openGate() {
    if (document.body.classList.contains('is-open')) return;
    document.body.classList.add('is-open');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    startPetals();
    startMusic();
  }
  $('#open').addEventListener('click', openGate);
  gate.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openGate(); });

  /* ---------- səhnənin en/boy uyğunlaşdırılması ----------
     Geniş (landscape) ekranlarda səhnə kəsilmir, yanlara əlavə bağ açılır. */
  const sceneSvgs = $$('svg.in[viewBox^="0 0 1200"], svg.in[data-fit]');
  const sceneImgs = $$('svg.in image[data-set]');
  let sceneSet = '';
  function fitScene() {
    const r = window.innerWidth / Math.max(1, $('.hero').clientHeight);
    const vw = Math.min(1700, Math.max(1200, 900 * r));
    const x = (1200 - vw) / 2;
    sceneSvgs.forEach(s => s.setAttribute('viewBox', `${x.toFixed(1)} 0 ${vw.toFixed(1)} 900`));
    // telefon (dar) üçün kiçik, geniş ekran üçün enli şəkil dəsti — yalnız lazım olan yüklənir
    const set = r < .76 ? 'p' : 'w';
    if (set !== sceneSet) {
      sceneSet = set;
      sceneImgs.forEach(im => {
        const on = im.dataset.set === set;
        im.setAttribute('display', on ? 'inline' : 'none');
        if (on && !im.getAttribute('href')) im.setAttribute('href', im.dataset.src);
      });
    }
  }
  window.addEventListener('resize', fitScene); fitScene();

  /* ---------- parallaks ---------- */
  const layers = $$('.layer').map(el => ({ el, d: parseFloat(el.dataset.depth) || 0 }));
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('pointermove', e => {
    mx = (e.clientX / window.innerWidth - .5) * 2;
    my = (e.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });
  window.addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    mx = Math.max(-1, Math.min(1, e.gamma / 25));
    my = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
  }, { passive: true });
  const hero = $('.hero');
  let lastSy = -1, lastCx = 99, lastCy = 99;
  function frame() {
    if (document.hidden) { requestAnimationFrame(frame); return; }
    cx += (mx - cx) * .06; cy += (my - cy) * .06;
    const sy = Math.min(window.scrollY, window.innerHeight * 1.2);
    // dəyişiklik yoxdursa DOM-a yazma (batareya / FPS)
    const idle = Math.abs(cx - lastCx) < .0008 && Math.abs(cy - lastCy) < .0008 && sy === lastSy;
    if (!reduce && !idle) {
      lastCx = cx; lastCy = cy; lastSy = sy;
      layers.forEach(({ el, d }) => {
        const x = -cx * d * 140;
        const y = -cy * d * 90 + sy * d * 1.6;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- geri sayım ---------- */
  const cdEls = {}; $$('#cd .num').forEach(n => { cdEls[n.dataset.u] = n; });
  const cdTitle = $('#cd-title');
  const last = {};
  function setNum(k, v) {
    const s = pad(v);
    if (last[k] !== s) { last[k] = s; cdEls[k].textContent = s; cdEls[k].classList.remove('tick'); void cdEls[k].offsetWidth; cdEls[k].classList.add('tick'); }
  }
  function tickCd() {
    let diff = target - new Date();
    if (diff <= 0) {
      $('#cd').classList.add('done');
      const end = new Date(`${C.date}T${C.endTime}:00${C.utcOffset}`);
      cdTitle.textContent = new Date() < end ? 'Bayram başladı — sizi gözləyirik!' : 'Bizimlə olduğunuz üçün təşəkkür edirik!';
      return;
    }
    const s = Math.floor(diff / 1000);
    setNum('days', Math.floor(s / 86400));
    setNum('hours', Math.floor(s % 86400 / 3600));
    setNum('minutes', Math.floor(s % 3600 / 60));
    setNum('seconds', s % 60);
  }
  tickCd(); setInterval(tickCd, 1000);

  /* ---------- təqvim ---------- */
  (function calendar() {
    const el = $('#cal');
    const days = ['B.e', 'Ç.a', 'Çər', 'C.a', 'Cüm', 'Şən', 'Baz'];
    const first = (new Date(Date.UTC(Y, M - 1, 1)).getUTCDay() + 6) % 7; // həftə bazar ertəsindən başlayır
    const count = new Date(Date.UTC(Y, M, 0)).getUTCDate();
    let h = `<div class="cal-head">${MONTHS[M - 1]} ${Y}</div><div class="cal-grid">`;
    days.forEach(d => h += `<span class="dow">${d}</span>`);
    for (let i = 0; i < first; i++) h += '<span></span>';
    for (let d = 1; d <= count; d++) h += `<span class="cell${d === D ? ' evt' : ''}"><span>${d}</span></span>`;
    h += '</div>';
    el.innerHTML = h;
  })();

  /* ---------- proqram (timeline) ---------- */
  const ICONS = {
    glass: '<path d="M9 3h6l-.6 8a2.4 2.4 0 0 1-4.8 0L9 3z"/><path d="M12 13.5V20M9 21h6"/><path d="M10.5 6.5h3"/>',
    ring: '<circle cx="12" cy="15" r="5.5"/><path d="M9.5 6.2 12 3l2.5 3.2L12 9z"/>',
    plate: '<circle cx="12" cy="12" r="4.5"/><path d="M3.5 4v5a1.6 1.6 0 0 0 3.2 0V4M5.1 4v16M20.5 4c-1.7 1.3-2.6 3.3-2.6 6h2.6v10"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    cake: '<path d="M4 20h16v-6.5H4z"/><path d="M6 13.5V10h12v3.5M12 10V7"/><path d="M12 3.6c.9 1 .9 2 0 3-.9-1-.9-2 0-3z"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'
  };
  (function timeline() {
    const ol = $('#timeline');
    C.program.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'tl-item reveal';
      li.style.setProperty('--d', (i % 2 ? .08 : 0) + 's');
      li.innerHTML = `<span class="tl-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[p.icon] || ICONS.heart}</svg></span>
        <div class="tl-time">${p.time}</div><h3>${p.title}</h3><p>${p.text}</p>`;
      ol.appendChild(li);
    });
    function upd() {
      const r = ol.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * .62 - r.top) / r.height));
      ol.style.setProperty('--p', p.toFixed(4));
    }
    let tick = false;
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; upd(); }); } }, { passive: true });
    window.addEventListener('resize', upd); upd();
  })();

  /* ---------- xəritə ---------- */
  (function map() {
    const q = encodeURIComponent(C.venue.mapQuery);
    $('#map').src = `https://www.google.com/maps?q=${q}&hl=az&z=16&output=embed`;
    $('#map-open').href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    $('#map-dir').href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
    $('#map-waze').href = `https://waze.com/ul?q=${q}&navigate=yes`;
    // Ünvana klik: telefonda Waze, kompüterdə Google Maps açılır
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.matchMedia('(pointer: coarse)').matches);
    $('#addr-link').href = mobile ? $('#map-waze').href : $('#map-open').href;
  })();

  /* xəritə kilidi (toxunma cihazlarında) */
  (function mapLock() {
    const fr = $('#map-frame');
    $('#map-lock').addEventListener('click', () => fr.classList.remove('locked'));
    document.addEventListener('touchstart', e => { if (!fr.contains(e.target)) fr.classList.add('locked'); }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { if (!es[0].isIntersecting) fr.classList.add('locked'); }, { threshold: 0 }).observe(fr);
  })();

  /* ---------- təqvimə əlavə (.ics) ---------- */
  $('#add-cal').addEventListener('click', () => {
    const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const start = target, end = new Date(`${C.date}T${C.endTime}:00${C.utcOffset}`);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sahmar//Invitation//AZ', 'BEGIN:VEVENT',
      `UID:${C.date}-${Date.now()}@sahmar`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${C.groom} & ${C.bride} — Nişan mərasimi`,
      `LOCATION:${C.venue.name}\\, ${C.venue.address}`,
      'DESCRIPTION:Sizi sevincimizi bölüşməyə dəvət edirik.',
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Sabah nişan mərasimi!', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'nisan-devetnamesi.ics';
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------- arxa fon musiqisi ---------- */
  (function music() {
    const M = C.music, btn = $('#music');
    if (!M || !M.src || !btn) return;
    const LOOP_FADE = M.loopFade == null ? 3 : Math.max(0, M.loopFade);
    const START = M.startAt || 0, TARGET = Math.max(0, Math.min(1, M.volume == null ? .14 : M.volume));
    const a = new Audio();
    a.preload = 'auto'; a.setAttribute('playsinline', ''); a.src = M.src;

    let muted = false, started = false, failed = false, token = 0, ctx = null, gain = null;
    try { muted = localStorage.getItem('music-muted') === '1'; } catch (_) { /* yoxdur */ }

    // iOS-da audio.volume dəyişmir → GainNode ilə səs idarə olunur
    a.volume = .5;
    const volumeWorks = Math.abs(a.volume - .5) < .01;
    function ensureGain() {
      if (volumeWorks || gain) return !!gain || volumeWorks;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0;
        ctx.createMediaElementSource(a).connect(gain); gain.connect(ctx.destination);
      } catch (_) { return false; }
      return true;
    }
    function setVol(v) { v = Math.max(0, Math.min(1, v)); if (volumeWorks) a.volume = v; else if (gain) gain.gain.value = v; }
    function getVol() { return volumeWorks ? a.volume : (gain ? gain.gain.value : 0); }
    function fade(to, ms, done) {
      const id = ++token, from = getVol(), t0 = performance.now();
      (function step(now) {
        if (id !== token) return;
        const k = Math.min(1, (now - t0) / ms);
        setVol(from + (to - from) * (k * k * (3 - 2 * k)));
        if (k < 1) requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    function seekStart() {
      const go = () => { try { a.currentTime = START; } catch (_) { /* yoxdur */ } };
      if (a.readyState >= 1) go(); else a.addEventListener('loadedmetadata', go, { once: true });
    }
    function ui(on) {
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Musiqini söndür' : 'Musiqini aç');
    }
    function play(fadeMs) {
      if (failed || !ensureGain()) return;
      if (ctx && ctx.state === 'suspended') ctx.resume();
      setVol(0);
      if (!started) seekStart();
      const p = a.play();
      const ok = () => {
        started = true; ui(true);
        if (a.currentTime < START - 1) seekStart();   // bəzi brauzerlər erkən seek-i əhəmiyyətsiz sayır
        fade(TARGET, fadeMs || 4000);
      };
      if (p && p.then) p.then(ok).catch(() => ui(false)); else ok();
    }
    function stop() { fade(0, 700, () => a.pause()); ui(false); }

    a.addEventListener('error', () => { failed = true; btn.hidden = true; });
    a.addEventListener('loadedmetadata', () => { if (!failed) btn.hidden = false; });
    // sona yaxınlaşanda yavaşca söndür, sonra 0:48-dən təkrar başlat
    a.addEventListener('timeupdate', () => {
      if (LOOP_FADE && a.duration && a.duration - a.currentTime < LOOP_FADE && getVol() > .01 && !a._fading) {
        a._fading = true; fade(0, LOOP_FADE * 900);
      }
    });
    a.addEventListener('ended', () => {
      a._fading = false; seekStart(); setVol(LOOP_FADE ? 0 : TARGET);
      a.play().then(() => { if (LOOP_FADE) fade(TARGET, LOOP_FADE * 1000); }).catch(() => ui(false));
    });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('on')) {
        muted = true; try { localStorage.setItem('music-muted', '1'); } catch (_) { /* yoxdur */ }
        stop();
      } else {
        muted = false; try { localStorage.removeItem('music-muted'); } catch (_) { /* yoxdur */ }
        play(1500);
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (started && !a.paused) { token++; a.pause(); } }
      else if (started && !muted && btn.classList.contains('on')) { a.play().then(() => fade(TARGET, 1500)).catch(() => {}); }
    });

    startMusic = function () {
      if (muted) { ui(false); return; }       // əvvəl söndürübsə, zorla başlatma
      play(4500);
    };
  })();

  /* ---------- reveal ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .05, rootMargin: '0px 0px -3% 0px' }) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* ---------- RSVP ---------- */
  const form = $('#rsvp-form');
  const guestsField = $('#guests-field');
  form.addEventListener('change', () => {
    guestsField.style.display = form.att.value === 'no' ? 'none' : '';
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) return form.name.focus();
    const yes = form.att.value === 'yes';
    const lines = [
      `Salam! Mən ${name}.`,
      yes ? `${C.groom} & ${C.bride} nişan mərasiminə (${pad(D)}.${pad(M)}.${Y}) gələcəyəm. Nəfər sayı: ${form.guests.value}.`
          : `${C.groom} & ${C.bride} nişan mərasiminə (${pad(D)}.${pad(M)}.${Y}) təəssüf ki, gələ bilməyəcəyəm.`,
      form.note.value.trim() ? `Qeyd: ${form.note.value.trim()}` : ''
    ].filter(Boolean).join('\n');
    try { localStorage.setItem('rsvp', JSON.stringify({ name, yes, t: Date.now() })); } catch (_) { /* yoxdur */ }
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
    form.hidden = true; $('#thanks').hidden = false;
    $('#thanks').scrollIntoView({ behavior: 'smooth', block: 'center' });
    burst();
  });

  /* ---------- ləçək yağışı (canvas) ---------- */
  const cv = $('#petals'), ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, petals = [], running = false, bursts = [];
  const PCOL = ['#F6DAD7', '#FBEAE6', '#F2C9C4', '#FFFFFF', '#E9C3BC', '#F4E4D8'];
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', size); size();
  function newPetal(initial) {
    const s = 5 + Math.random() * 7;
    return { x: Math.random() * W, y: initial ? Math.random() * H : -20 - Math.random() * 60, s,
      vy: .4 + Math.random() * .7, vx: -.15 + Math.random() * .5, r: Math.random() * 6.28, vr: (Math.random() - .5) * .04,
      sw: Math.random() * 6.28, sws: .01 + Math.random() * .02, c: PCOL[Math.floor(Math.random() * PCOL.length)], o: .55 + Math.random() * .4 };
  }
  function drawPetal(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, .62 + Math.abs(Math.sin(p.sw * 1.7)) * .38);
    ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.bezierCurveTo(p.s * .9, -p.s * .6, p.s * .8, p.s * .7, 0, p.s); ctx.bezierCurveTo(-p.s * .8, p.s * .7, -p.s * .9, -p.s * .6, 0, -p.s); ctx.fill();
    ctx.restore();
  }
  function startPetals() {
    if (running || reduce) return; running = true;
    const n = W < 600 ? 14 : 30;
    setTimeout(() => { for (let i = 0; i < n; i++) petals.push(newPetal(true)); }, 3200);
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      const visible = window.scrollY < window.innerHeight * 1.1;
      if (visible) {
        petals.forEach((p, i) => {
          p.sw += p.sws; p.x += p.vx + Math.sin(p.sw) * .5; p.y += p.vy; p.r += p.vr;
          if (p.y > H + 20 || p.x > W + 30 || p.x < -30) petals[i] = newPetal(false);
          drawPetal(p);
        });
      }
      bursts = bursts.filter(b => b.life > 0);
      bursts.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .06; b.r += b.vr; b.life--; b.o = Math.min(.9, b.life / 40); drawPetal(b); });
      requestAnimationFrame(loop);
    })();
  }
  function burst() {
    if (reduce) return;
    // RSVP-dən sonra ləçəklər: tam ekran canvas lazımdır
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:95;pointer-events:none';
    document.body.appendChild(c);
    const w = c.width = innerWidth, h = c.height = innerHeight, g = c.getContext('2d');
    const ps = Array.from({ length: 70 }, () => ({ x: w / 2 + (Math.random() - .5) * 80, y: h * .55, vx: (Math.random() - .5) * 9, vy: -5 - Math.random() * 8,
      s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .2, c: PCOL[Math.floor(Math.random() * PCOL.length)], life: 140 + Math.random() * 60 }));
    (function l() {
      g.clearRect(0, 0, w, h); let alive = 0;
      ps.forEach(p => {
        if (p.life-- <= 0) return; alive++;
        p.x += p.vx; p.y += p.vy; p.vy += .16; p.vx *= .99; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.globalAlpha = Math.min(1, p.life / 40); g.fillStyle = p.c;
        g.beginPath(); g.ellipse(0, 0, p.s, p.s * .55, 0, 0, 6.3); g.fill(); g.restore();
      });
      if (alive) requestAnimationFrame(l); else c.remove();
    })();
  }
  /* test üçün: index.html#skip dərvazanı keçir */
  if (location.hash === '#skip') openGate();
})();
