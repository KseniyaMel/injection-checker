const puppeteer = require('puppeteer');
const fs = require('fs');
const { sql_data } = require('./sql_data');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = 'http://localhost:3000';

  await page.goto(url);

  let results = 'sentence,time,isAttack,isPreventAttack\n';


  for (const payload of sql_data.slice(0,10)) {
    if(payload.Label !== '0' || payload.Label !== '1' ) continue;
    await page.reload();
    const startTime = Date.now();

    await page.type('#form_input', payload.Sentence);
    await page.click('#submit_button');

    await page.waitForTimeout(1000);

    const endTime = Date.now();

    const elementText = await page.$eval('#result', element => element.textContent);
    const isSuccess = elementText === 'valid' ? 0 : elementText === 'not valid' ? 1 : null
    results += `${payload.Sentence},${endTime - startTime - 1000} мс,${payload.Label},${isSuccess}\n`;
  }

  fs.writeFileSync('results_sql.txt', results);

  await browser.close();
})();
