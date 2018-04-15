const puppeteer = require('puppeteer'),
logger = require('../../logger');

let proxies = new Set();

module.exports = {
    getProxies: () => {
        return new Promise(async resolve => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://free-proxy-list.net', {waitUntil: 'load'});
            const proxiesList = await page.evaluate(() => {
                return [...document.querySelectorAll("table#proxylisttable tbody tr")].map(elem => {
                    const proxyHost = elem.querySelectorAll("td")[0].innerText;
                    const proxyPort = elem.querySelectorAll("td")[1].innerText;
                    return proxyHost + ":" + proxyPort;
                })
            });
            logger.log("Proxy list", proxiesList.length);
            proxies = new Set([...proxies, ...proxiesList]);
            await browser.close();
            resolve(proxies);
        })
    }
}