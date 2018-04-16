const puppeteer = require('puppeteer'),
proxyUtil = require('../proxy/proxy-util'),
logger = require('../logger');

const YoutubeUtil = {

    getVideoLinks: (channelId) => {
        logger.log('Retrieve links for', channelId);
        return new Promise(async resolve => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://www.youtube.com/channel/' + channelId + '/videos', { waitUntil: 'networkidle2' }); //UChKMGbfYuup8KcWL5uAuiEQ

            page.evaluate(() => window.scrollBy(0, window.innerHeight));

            const videoUrls = await page.evaluate(() => {
                return [...document.querySelectorAll('ytd-grid-video-renderer a#video-title')].map(elem => elem.getAttribute('href'))
            });

            logger.log('Videos length', videoUrls.length);
            await browser.close();

            resolve(videoUrls);
        })
    },

    openVideo: (url, proxy) => {
        if (!url || !proxy) {
            throw new Error("Invalid url or proxy", url, proxy);
        }

        return new Promise(async resolve => {
            logger.log('Opening', url, 'with proxy', proxy);
            const browser = await puppeteer.launch({
                headless: false,
                ignoreHTTPSErrors: true,
                args: [
                    '--proxy-server=' + proxy,
                ]
            });
            const page = await browser.newPage();
            page.goto(url, { waitUntil: 'networkidle2' })
            .then(async () => {
                logger.log("Loaded", url, "successfully");

                const videoWatchTime = util.randomBetween(10 * 1000, 5 * 60 * 1000);
                logger.log("Watching video for", videoWatchTime);
                await util.sleep(videoWatchTime);

                await browser.close();

                resolve();
            })
            .catch(async () => {
                logger.error("Bad Proxy:", proxy)
                proxyUtil.removeProxy(proxy);
                await browser.close();

                const randomProxy = await proxyUtil.getRandomProxy();
                await YoutubeUtil.openVideo(url, randomProxy)
                resolve();
            });
        });
    }
}

module.exports = YoutubeUtil;