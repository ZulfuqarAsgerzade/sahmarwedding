/* Suluboya səhnənin təbii detalları (ağaclar, çitlər, çiçəklər, budaqlar).
   Seed-li təsadüfilik: hər açılışda eyni nəticə verir. */
(function () {
  'use strict';

  function rng(seed) {
    let s = seed >>> 0;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  const f = n => Math.round(n * 10) / 10;
  const circ = (x, y, r, fill, o) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"${o != null ? ` opacity="${o}"` : ''}/>`;
  const ell = (x, y, rx, ry, rot, fill, o) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(rot)} ${f(x)} ${f(y)})" fill="${fill}"${o != null ? ` opacity="${o}"` : ''}/>`;
  const leaf = (x, y, len, wid, rot, fill, o) =>
    `<path d="M0 0 Q${f(len * .5)} ${f(-wid)} ${f(len)} 0 Q${f(len * .5)} ${f(wid)} 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})" fill="${fill}"${o != null ? ` opacity="${o}"` : ''}/>`;

  const GREENS = ['#8FA786', '#7C957A', '#9DB594', '#6F8A6F', '#B0C3A3', '#86A07F'];
  const DEEP = ['#5F7E5F', '#6C8B66', '#587659'];
  const FLOWERS = ['#E9AEB0', '#F2CFC8', '#FBF8F1', '#B3A6D6', '#8FB1DA', '#F0C39A', '#F5DDD8'];

  const $ = id => document.getElementById(id);

  /* ---------- ağaclar (uzaq plan) ---------- */
  function tree(r, x, y, s, pale) {
    let o = '';
    o += `<rect x="${f(x - 3 * s)}" y="${f(y - 40 * s)}" width="${f(6 * s)}" height="${f(48 * s)}" fill="#6B5B49" opacity="${pale ? .25 : .5}"/>`;
    const n = 22;
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 50 * s;
      const cx = x + Math.cos(a) * d * 1.05, cy = y - 118 * s + Math.sin(a) * d * 1.15;
      o += circ(cx, cy, (17 + r() * 24) * s, pale ? pick(r, ['#B8C8AE', '#C3D1B8', '#AEBFA5']) : pick(r, GREENS), pale ? .8 : .88);
    }
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (1 + r() * .6), d = (16 + r() * 34) * s;
      o += circ(x + Math.cos(a) * d, y - 118 * s + Math.sin(a) * d * 1.1, (10 + r() * 14) * s, pale ? '#D6E0CC' : '#C3D3B6', .65);
    }
    return o;
  }

  function buildFar() {
    const g = $('trees-far'); if (!g) return;
    const r = rng(21);
    let o = '';
    [[-90, 640, 1.4, 0], [-230, 640, 1.3, 1], [-380, 640, 1.4, 0], [1290, 640, 1.4, 0], [1430, 640, 1.3, 1], [1580, 640, 1.4, 0], [40, 640, 1.35, 1], [1170, 640, 1.35, 1], [790, 585, .8, 1], [410, 585, .8, 1], [880, 610, .95, 0], [320, 610, .95, 0],
     [130, 630, 1.2, 0], [1080, 630, 1.2, 0], [220, 640, 1.3, 0], [980, 640, 1.3, 0], [700, 580, .6, 1], [500, 580, .6, 1]]
      .sort((a, b) => a[2] - b[2])
      .forEach(t => { o += tree(r, t[0], t[1], t[2], !!t[3]); });
    // uzaq kiçik tozlu ağaclar (şatonun arxası)
    for (let i = 0; i < 10; i++) o += circ(330 + i * 60 + r() * 20, 560 + r() * 16, 22 + r() * 14, '#B5C7AC', .6);
    g.innerHTML = o;
  }

  /* ---------- gravel, çit, çiçək yatağı ---------- */
  function buildGround() {
    const r = rng(77);
    // yol: sol kənar x = 586 - 176t, sağ kənar x = 614 + 176t, y = 598 + 312t
    const gv = $('gravel');
    if (gv) {
      let o = '';
      for (let i = 0; i < 340; i++) {
        const t = Math.pow(r(), .8), y = 600 + t * 308;
        const half = 14 + 176 * t;
        const x = 600 + (r() * 2 - 1) * half * .93;
        const s = .8 + t * 3.2;
        o += ell(x, y, s * (1 + r()), s * .5, r() * 40 - 20, pick(r, ['#D9C9AC', '#E6D8BE', '#FFFFFF', '#CDBB9C']), .35 + r() * .35);
      }
      gv.innerHTML = o;
    }

    const hg = $('hedges');
    if (hg) {
      let o = '';
      [-1, 1].forEach(side => {
        let t = 0.02;
        const items = [];
        while (t < 1.02) {
          const rad = 5 + 36 * Math.pow(t, 1.05);
          const y = 598 + 312 * t;
          const x = 600 + side * (14 + 176 * t + rad * .85);
          items.push([x, y - rad * .15, rad]);
          t += (rad * 1.35) / 312;
        }
        items.forEach(([x, y, rad]) => {
          o += circ(x, y, rad, pick(r, DEEP));
          o += circ(x - rad * .15, y - rad * .28, rad * .8, pick(r, ['#7B9A72', '#86A57B']), .95);
          o += circ(x - rad * .28, y - rad * .45, rad * .42, '#A4C09A', .8);
          if (rad > 14) for (let k = 0; k < 4; k++) o += circ(x + (r() - .5) * rad * 1.2, y + (r() - .5) * rad, rad * .12, '#5C7C5D', .5);
        });
        // giriş yanındakı topiary topları
        const bx = 600 + side * 52;
        o += `<rect x="${bx - 1.6}" y="598" width="3.2" height="10" fill="#6B5B49" opacity=".7"/>`;
        o += circ(bx, 592, 9.5, '#648262') + circ(bx - 2, 589, 7, '#7FA076') + circ(bx - 3, 586, 3.5, '#A7C39B', .8);
      });
      hg.innerHTML = o;
    }

    const bd = $('beds');
    if (bd) {
      let o = '';
      [-1, 1].forEach(side => {
        const items = [];
        // yaşıl baza kütləsi
        for (let i = 0; i < 70; i++) {
          const u = Math.pow(r(), .75), y = 612 + u * 296, t = (y - 598) / 312;
          const edge = 14 + 176 * t + (5 + 36 * Math.pow(t, 1.05)) * 1.9 + 8;
          const xr = edge + r() * (560 + 140 * t);
          const x = 600 + side * xr;
          const sz = 5 + t * 26;
          o += ell(x, y, sz * 1.6, sz * .8, r() * 30 - 15, pick(r, GREENS), .75);
        }
        // çiçəklər
        for (let i = 0; i < 300; i++) {
          const u = Math.pow(r(), .7), y = 612 + u * 296, t = (y - 598) / 312;
          const edge = 14 + 176 * t + (5 + 36 * Math.pow(t, 1.05)) * 1.9 + 6;
          const x = 600 + side * (edge + r() * (580 + 140 * t));
          items.push([x, y, t]);
        }
        items.sort((a, b) => a[1] - b[1]);
        items.forEach(([x, y, t]) => {
          const s = 2.4 + t * 11;
          const col = pick(r, FLOWERS);
          o += leaf(x, y, s * 1.6, s * .55, -90 + (r() - .5) * 80, pick(r, ['#6F8A62', '#7E9970']), .85);
          if (s > 6) {
            for (let k = 0; k < 5; k++) {
              const a = k * 72 + r() * 30;
              o += circ(x + Math.cos(a * Math.PI / 180) * s * .55, y - s * .6 + Math.sin(a * Math.PI / 180) * s * .55, s * .46, col, .93);
            }
            o += circ(x, y - s * .6, s * .24, pick(r, ['#F2D58D', '#E9B27E', '#FFF6D8']));
          } else {
            o += circ(x, y - s * .5, s * .7, col, .95);
            o += circ(x + s * .35, y - s * .9, s * .5, col, .85);
          }
        });
        // hündür delfinium (mavi sünbül)
        for (let i = 0; i < 16; i++) {
          const u = .25 + r() * .75, y = 640 + u * 262, t = (y - 598) / 312;
          const x = 600 + side * (14 + 176 * t + 60 + 40 * t + r() * (360 + 140 * t));
          const h = 22 + 70 * t;
          o += `<path d="M${f(x)} ${f(y)} q ${f(r() * 4 - 2)} ${f(-h * .5)} ${f(r() * 6 - 3)} ${f(-h)}" stroke="#6F8A62" stroke-width="${f(1 + 1.6 * t)}" fill="none"/>`;
          const col = pick(r, ['#8FB1DA', '#7B93C9', '#A9B8E6']);
          for (let k = 0; k < 9; k++) {
            const yy = y - h * (.35 + .65 * k / 9);
            const rr = (1.8 + 4.2 * t) * (1 - k / 14);
            o += circ(x + (r() - .5) * rr * 2, yy, rr, col, .95);
          }
        }
      });
      bd.innerHTML = o;
    }
  }

  /* ---------- ön plan budaqları (yuxarı küncler) ---------- */
  function blossom(r, x, y, s) {
    let o = '';
    const base = pick(r, ['#F6DAD7', '#FBEAE6', '#F2C9C4']);
    for (let k = 0; k < 5; k++) {
      const a = k * 72 + r() * 10;
      o += ell(x + Math.cos(a * Math.PI / 180) * s * .62, y + Math.sin(a * Math.PI / 180) * s * .62, s * .66, s * .46, a, base, .96);
    }
    o += circ(x, y, s * .26, '#E7B58E');
    for (let k = 0; k < 5; k++) o += circ(x + (r() - .5) * s * .6, y + (r() - .5) * s * .6, s * .06, '#B5754F');
    return o;
  }

  function branch(seed, W, H, flip) {
    const r = rng(seed);
    const P0 = [-30, 14 + r() * 20], C = [W * .36, H * .02 + r() * 24], P1 = [W * .94, H * (.5 + r() * .12)];
    const B = t => [
      (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P1[0],
      (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P1[1]];
    const ang = t => {
      const dx = 2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P1[0] - C[0]);
      const dy = 2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P1[1] - C[1]);
      return Math.atan2(dy, dx) * 180 / Math.PI;
    };
    let o = `<path d="M${P0[0]} ${P0[1]} Q${C[0]} ${C[1]} ${P1[0]} ${P1[1]}" stroke="#6D7F5E" stroke-width="5" fill="none" stroke-linecap="round" opacity=".92"/>`;
    o += `<path d="M${P0[0]} ${P0[1] - 2} Q${C[0]} ${C[1] - 2} ${P1[0]} ${P1[1] - 2}" stroke="#93A584" stroke-width="1.6" fill="none" opacity=".7"/>`;
    const N = 15;
    const blossoms = [];
    for (let i = 0; i < N; i++) {
      const t = .08 + (i / N) * .9, [x, y] = B(t), a = ang(t);
      const side = i % 2 ? 1 : -1;
      const len = (46 + r() * 30) * (1 - t * .35);
      o += leaf(x, y, len, len * .26, a + side * (34 + r() * 36), pick(r, GREENS), .93);
      if (i % 3 === 0) o += leaf(x, y, len * .75, len * .2, a - side * (30 + r() * 30), pick(r, ['#A8BE9C', '#9DB594']), .9);
      if (i % 4 === 1) blossoms.push([x + side * 10, y + 14 + r() * 24, 9 + r() * 6]);
    }
    // yan budaqcıqlar
    [.3, .55, .75].forEach((t, j) => {
      const [x, y] = B(t), a = ang(t) + (j % 2 ? -1 : 1) * (50 + r() * 10);
      const ex = x + Math.cos(a * Math.PI / 180) * 56, ey = y + Math.sin(a * Math.PI / 180) * 56;
      o += `<path d="M${f(x)} ${f(y)} L${f(ex)} ${f(ey)}" stroke="#6D7F5E" stroke-width="2.4" stroke-linecap="round"/>`;
      for (let k = 0; k < 4; k++) {
        const tt = (k + 1) / 4.4, lx = x + (ex - x) * tt, ly = y + (ey - y) * tt;
        o += leaf(lx, ly, 26 + r() * 12, 8, a + (k % 2 ? 40 : -40), pick(r, GREENS), .92);
      }
      blossoms.push([ex, ey, 10 + r() * 4]);
    });
    blossoms.forEach(([x, y, s]) => { o += blossom(r, x, y, s); });
    // sallanan tumurcuqlar
    for (let i = 0; i < 3; i++) {
      const t = .35 + r() * .55, [x, y] = B(t);
      o += `<path d="M${f(x)} ${f(y)} q ${f(r() * 8 - 4)} 22 ${f(r() * 10 - 5)} ${f(30 + r() * 20)}" stroke="#7B8F6B" stroke-width="1.4" fill="none"/>`;
      o += circ(x + 1, y + 36 + r() * 12, 4.5, '#F2C9C4');
    }
    return o;
  }

  /* ---------- ön plan alt çiçəkləri (aşağı küncler) ---------- */
  function hydrangea(r, cx, cy, R, hues) {
    let o = '';
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R;
      const rr = R * (.1 + r() * .08);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .85;
      o += circ(x, y, rr, pick(r, hues), .95);
      o += circ(x - rr * .25, y - rr * .25, rr * .45, '#FFFFFF', .35);
    }
    return o;
  }
  function rose(cx, cy, R, base, mid) {
    return circ(cx, cy, R, base) + circ(cx, cy, R * .74, mid) + circ(cx - R * .08, cy - R * .08, R * .48, base, .9)
      + `<path d="M${f(cx - R * .5)} ${f(cy)} q ${f(R * .5)} ${f(-R * .7)} ${f(R)} 0 q ${f(-R * .5)} ${f(R * .6)} ${f(-R * .7)} ${f(R * .1)}" stroke="#C97F86" stroke-width="1.2" fill="none" opacity=".8"/>`;
  }

  function corner(seed, W, H, mirror) {
    const r = rng(seed);
    let o = '';
    const x = v => mirror ? W - v : v;
    // yaşıl yarpaq kütləsi
    for (let i = 0; i < 46; i++) {
      const px = r() * W * .75, py = H * (.38 + r() * .62);
      o += leaf(x(px), py, 46 + r() * 54, 13 + r() * 9, (mirror ? 180 : 0) + (-95 + (r() - .5) * 150) * (mirror ? -1 : 1), pick(r, [...GREENS, ...DEEP]), .92);
    }
    // kolluq, hortensiya
    const blues = ['#8FB1DA', '#A9C3E6', '#7B93C9', '#B7AAD0', '#C9D8F0', '#FBF8F1'];
    const pinks = ['#F2CFC8', '#E9AEB0', '#F5DDD8', '#FBF8F1'];
    o += hydrangea(r, x(70), H * .78, 66, blues);
    o += hydrangea(r, x(190), H * .88, 54, pinks);
    o += hydrangea(r, x(300), H * .95, 44, blues);
    o += hydrangea(r, x(30), H * .54, 40, pinks);
    // qızılgüllər
    o += rose(x(130), H * .66, 20, '#E8A9AA', '#F2C3C0');
    o += rose(x(236), H * .76, 16, '#F5DDD8', '#FBEDE8');
    o += rose(x(36), H * .93, 22, '#E8A9AA', '#F4CCC8');
    // kiçik çiçəklər
    for (let i = 0; i < 26; i++) {
      const px = r() * W * .7, py = H * (.45 + r() * .55), s = 6 + r() * 7;
      o += blossom(r, x(px), py, s);
    }
    return o;
  }

  function buildForeground() {
    const tl = $('fg-tl'), tr = $('fg-tr'), bl = $('fg-bl'), br = $('fg-br');
    if (tl) tl.innerHTML = `<g filter="url(#wc-fine)">${branch(5, 560, 330, false)}</g>`;
    if (tr) tr.innerHTML = `<g filter="url(#wc-fine)"><g transform="translate(560 0) scale(-1 1)">${branch(11, 560, 330, true)}</g></g>`;
    if (bl) bl.innerHTML = `<g filter="url(#wc-fine)">${corner(31, 520, 300, false)}</g>`;
    if (br) br.innerHTML = `<g filter="url(#wc-fine)">${corner(47, 520, 300, true)}</g>`;
  }

  buildFar();
  buildGround();
  buildForeground();
})();
