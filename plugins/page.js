const puppeteer = require('puppeteer'),
logger = require('../logger'),
util = require('../util/util'),
request = require('request'),
proxyUtil = require('../proxy/proxy-util');

const _visitWithPuppeteer = (url) => {
    return new Promise(async resolve => {
        const randomProxy = await proxyUtil.getRandomProxy();
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            args: [
                '--proxy-server=' + randomProxy,
            ]
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' })
        logger.log("Loaded", url, "successfully");
        let body = await page.evaluate(() => document.body.innerText);
        logger.log(body);
        browser.close();
        resolve();
    })
},
_visitWithRequest = (url) => {
    return new Promise(async resolve => {
        logger.log("Loading", url);
        request(url, (err, res, body) => {
            logger.log("Loaded", url);
            logger.log(body)
            resolve();
        })
    });
}

class Page {
    constructor (usePuppeteer) {
        this.usePuppeteer = usePuppeteer;
    }

    visit(url) {
        return this.usePuppeteer ? _visitWithPuppeteer(url) : _visitWithRequest(url);
    }
}

module.exports = Page;