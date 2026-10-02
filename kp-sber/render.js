const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + __dirname + '/kp-sber.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  // fail loudly if a page overflows its A4 box
  const over = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg, i) => {
    const r = pg.getBoundingClientRect(); let m = 0;
    pg.querySelectorAll('*').forEach(e => { const q = e.getBoundingClientRect(); if (q.height && !e.closest('.glow,.gridbg') && !e.classList.contains('glow')) m = Math.max(m, q.bottom - r.top); });
    return `p${i+1}: content bottom ${Math.round(m)}px / ${Math.round(r.height)}px`;
  }));
  console.log(over.join('\n'));
  await p.pdf({ path: process.argv[2] || 'КП_GPTunneL_Сбер.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
