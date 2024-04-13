const puppeteer = require('puppeteer');
const fs = require('fs');
const { xss_data } = require('./xss_data');

const generateTestData = (size) => {
  const testData = [];
  for(let i = 0; i<=size; i++){
    testData.push(xss_data[Math.floor(Math.random()*xss_data.length)])
  }
  return testData;
}

async function check(page, validator, browser_name) {
  let results = 'id,time,isAttack,isPreventAttack\n';
  const testData = generateTestData(1000);
  console.log(`Проверяется валидатор ${validator}`);

  for (const payload of testData) {
    await page.reload();
    await page.click(`input[type="radio"][value="${validator}"]`);
    const startTime = Date.now();

    await page.type('#form_input', payload.Sentence);
    await page.click('#submit_button');

    await page.waitForTimeout(1000);

    const endTime = Date.now();

    const elementText = await page.$eval('#result', element => element.textContent);
    const isSuccess = elementText === 'valid' ? 0 : elementText === 'not valid' ? 1 : null
    results += `${payload['Id']},${endTime - startTime - 1000} мс,${payload.Label},${isSuccess}\n`;
  }

  fs.writeFileSync(`results_xss_${validator}_${browser_name}.csv`, results);
}

(async () => {
  const test = async (browser, browser_name) => {
    const page = await browser.newPage();

    const url = 'http://localhost:3000';
  
    await page.goto(url);
  
    await check(page, 'none', browser_name);
  
    await check(page, 'DOMPurify', browser_name);
  
    await check(page, 'xssFilters', browser_name);
  
    await check(page, 'yup', browser_name);
  
    await browser.close();
  }

  try {
    const chrome = await puppeteer.launch();
    await test(chrome, 'chrome');
  } catch(e) {
    console.error(e)
  }

})();