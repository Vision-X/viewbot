const puppeteer = require('puppeteer'),
logger = require('./logger'),
util = require('./util/util'),
youtubeUtil = require('./util/youtube-util');
proxyUtil = require('./util/proxy-util');

const promisesQueue = new Array();
const MAX_QUEUE_LENGTH = 3;
let videosRunning = 0;

function queuePromise(videoUrls) {
    if (promisesQueue.length >= MAX_QUEUE_LENGTH) {
        return;
    }

    return new Promise(async resolve => {
        const url = util.getRandomItem(videoUrls);
        logger.log("Queuing", url)
        const randomProxy = await proxyUtil.getRandomProxy();
        const videoUrl = 'http://www.youtube.com' + url;
        const promise = youtubeUtil.openVideo(videoUrl, randomProxy);
        promisesQueue.push(promise);
        logger.log("Queued", url)
        resolve();
    })
}

module.exports = {
    visit: (channelId) => {
        channelId = 'UChKMGbfYuup8KcWL5uAuiEQ';
        const videoUrls = await youtubeUtil.getVideoLinks(channelId);
        await queuePromise(videoUrls);
    }
}