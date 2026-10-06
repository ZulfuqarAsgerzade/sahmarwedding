/* Illustrasiyanı hazır WebP şəkillərə çevirir ("baking").
   İstifadə: git checkout svg-source  →  saytı yerli serverdə aç  →  bu skripti brauzer konsolunda işlət,
   http://localhost:5174/save?name=... ünvanında şəkilləri qəbul edən kiçik server lazımdır.
   Niyə: SVG filtrləri (feTurbulence/feDisplacementMap) və 7000+ element telefonu yavaşladır. */
(async () => {
  const defs = document.querySelector('svg[aria-hidden] defs').outerHTML;
  const inner = sel => document.querySelector(sel).innerHTML;
  const out = [];
  async function bake(name, content, x, y, w, h, scale, q) {
    const W = Math.round(w * scale), H = Math.round(h * scale);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${W}" height="${H}">${defs}${content}</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('svg load ' + name)); img.src = url; });
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    c.getContext('2d').drawImage(img, 0, 0, W, H);
    const blob = await new Promise(r => c.toBlob(r, 'image/webp', q));
    const res = await fetch('http://localhost:5174/save?name=' + name, { method: 'POST', body: blob });
    out.push(await res.text() + ` (${W}x${H})`);
    URL.revokeObjectURL(url);
  }
  const back = inner('.in-sky') + inner('.in-far') + inner('.in-manor');
  const ground = inner('.in-ground');
  // portret (telefon): x 250..950
  await bake('back-p.webp', back, 250, 0, 700, 680, 2.2, .82);
  await bake('ground-p.webp', ground, 250, 560, 700, 340, 2.2, .84);
  // geniş ekran: x -250..1450
  await bake('back-w.webp', back, -250, 0, 1700, 680, 1.6, .8);
  await bake('ground-w.webp', ground, -250, 560, 1700, 340, 1.6, .82);
  // gəlin-bəy
  await bake('couple.webp', inner('.in-couple'), 500, 570, 280, 330, 3, .9);
  // ön plan budaqları və çiçəklər
  await bake('fg-tl.webp', inner('#fg-tl'), 0, 0, 560, 330, 2, .86);
  await bake('fg-tr.webp', inner('#fg-tr'), 0, 0, 560, 330, 2, .86);
  await bake('fg-bl.webp', inner('#fg-bl'), 0, 0, 520, 300, 2, .86);
  await bake('fg-br.webp', inner('#fg-br'), 0, 0, 520, 300, 2, .86);
  return out;
})();
