import puppeteer from 'puppeteer';

export const getPlannedOutages = async () => {
  const url = 'https://selfservice.kplc.co.ke/';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await page.setViewport({ width: 1368, height: 669 });
};
