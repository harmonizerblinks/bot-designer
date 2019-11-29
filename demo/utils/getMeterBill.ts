import puppeteer from 'puppeteer';
import uuid from 'uuid/v4';

export const getMeterBill = async (meterNumber: string): Promise<string> => {
  const url = 'https://selfservice.kplc.co.ke/';
  const filePath = `demo/screenshots/screenshot-${uuid()}.png`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' })
  
  await page.setViewport({ width: 1368, height: 669 })
  
  await page.waitForSelector('#container-1077-innerCt > #button-1078 > #button-1078-btnWrap #button-1078-btnInnerEl')
  await page.click('#container-1077-innerCt > #button-1078 > #button-1078-btnWrap #button-1078-btnInnerEl')
  
  await page.waitForSelector('#ext-element-7 > #radiofield-1098 > #radiofield-1098-bodyEl #radiofield-1098-boxLabelEl')
  await page.click('#ext-element-7 > #radiofield-1098 > #radiofield-1098-bodyEl #radiofield-1098-boxLabelEl')
  
  await page.waitForSelector('#textfield-1100 > #textfield-1100-bodyEl > #textfield-1100-triggerWrap #textfield-1100-inputEl')
  await page.click('#textfield-1100 > #textfield-1100-bodyEl > #textfield-1100-triggerWrap #textfield-1100-inputEl')

  await page.keyboard.type(meterNumber.toString());
  
  await page.waitForSelector('#panel-1099-targetEl > #button-1102 > #button-1102-btnWrap #button-1102-btnInnerEl')
  await page.click('#panel-1099-targetEl > #button-1102 > #button-1102-btnWrap #button-1102-btnInnerEl')
  
  await page.waitForSelector('#searchpanelform-1094 > #loadmask-1144 > #loadmask-1144-msgWrapEl #loadmask-1144-msgTextEl')
  await page.click('#searchpanelform-1094 > #loadmask-1144 > #loadmask-1144-msgWrapEl #loadmask-1144-msgTextEl')
  
  await page.waitForSelector('#panel-1147-outerCt > #panel-1147-innerCt > div > div > p:nth-child(7)')
  await page.click('#panel-1147-outerCt > #panel-1147-innerCt > div > div > p:nth-child(7)')

  await page.screenshot({
    fullPage: true,
    path: filePath,
  });

  await browser.close();

  return filePath;
};
