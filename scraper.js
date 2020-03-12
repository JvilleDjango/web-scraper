const puppeteer = require("puppeteer");
const chalk = require('chalk');
const C = require("./constants");
const USERNAME_SELECTOR = "#id_loginId";
const PASSWORD_SELECTOR = "#id_password";
const CTA_SELECTOR =
    "#main-container > div > div:nth-child(2) > div > form > div > div:nth-child(6) > div > input";

async function startBrowser() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    return {
        browser,
        page
    };
}

async function closeBrowser(browser) {
    return browser.close();
}

async function playTest(url) {
    const {
        browser,
        page
    } = await startBrowser();
    page.setViewport({
        width: 1366,
        height: 768
    });
    await page.goto(url);
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(C.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(C.password);
    await page.click(CTA_SELECTOR);

    await page.waitForXPath('//*[@id="account-18910075"]/div/div[2]/div[2]/div[1]/p/span[2]');
    await page.waitForXPath('//*[@id="account-18910075"]/div/div[2]/div[2]/div[2]/p/text()');

    const [el] = await page.$x('//*[@id="account-18910075"]/div/div[2]/div[2]/div[1]/p/span[2]');
    const date_due = await el.getProperty('textContent');
    const dateTxt = await date_due.jsonValue();


    const [a_due] = await page.$x('//*[@id="account-18910075"]/div/div[2]/div[2]/div[2]/p/text()');
    const amount_due = await a_due.getProperty('textContent');
    const amountTxt = await amount_due.jsonValue();

    //   await page.screenshot({path: 'trello.png'});
    console.log(chalk.green(dateTxt, amountTxt))
}



    (async () => {
        await playTest("https://ipn2.paymentus.com/cp/juaz");
        process.exit(1);
    })();