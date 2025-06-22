const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let products = [];
  const target = 500;

  const urls = [
    'https://www.eigeradventure.com/new-arrival',
    'https://www.eigeradventure.com/bags',
    'https://www.eigeradventure.com/apparel',
    'https://www.eigeradventure.com/shoes',
    'https://www.eigeradventure.com/accessories'
  ];

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle2' });
    while (products.length < target) {
      const items = await page.$$eval('.product-item', cards =>
        cards.map(c => {
          const img = c.querySelector('img')?.src;
          const title = c.querySelector('.product-item-name')?.textContent.trim();
          const desc = c.querySelector('.short-description')?.textContent.trim() || '';
          return img && title ? { img, title, desc } : null;
        }).filter(Boolean)
      );
      items.forEach(p => {
        if (products.length < target && !products.some(x => x.img === p.img)) products.push(p);
      });
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(1000);
      if (items.length === 0) break;
    }
    if (products.length >= target) break;
  }

  await browser.close();
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
  console.log(`Saved ${products.length} products.`);
})();
