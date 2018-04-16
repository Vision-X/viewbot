const puppeteer = require('puppeteer'),
logger = require('../logger'),
util = require('../util/util'),
proxyUtil = require('../proxy/proxy-util');

const Page = {
    visit: (url) => {
        return new Promise(async resolve => {
            const randomProxy = await proxyUtil.getRandomProxy();
            const browser = await puppeteer.launch({
                ignoreHTTPSErrors: true,
                // args: [
                //     '--proxy-server=' + proxy,
                // ]
            });
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' })
            logger.log("Loaded", url, "successfully");
            let body = await page.evaluate(() => document.body.innerText);
            logger.log(body);
            resolve();
        })
    }
}

module.exports = Page;