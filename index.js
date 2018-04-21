const util = require('./util/util'),
proxyUtil = require('./proxy/proxy-util'),
logger = require('./logger'),
PromisePool = require('es6-promise-pool'),
Page = require('./plugins/page');

const argv = require('yargs')
                .usage('Usage: $0 <command> [options]')
                .example('$0 --url pageUrl --count 10', 'visit the page 10 times')
                .alias('c', 'count')
                .alias('p', 'use-puppeteer')
                .help('h')
                .alias('h', 'help')
                .argv;

; (async () => {
    const count = argv.count || 1;
    logger.log('Running for ' + count + ' times');

    if (argv.url) {
        const urls = argv.url.split(",");
        const usePuppeteer = argv.usePuppeteer || true;
        const maxConcurrent = argv.maxConcurrent || 3;

        const page = new Page(usePuppeteer);

        const generatePromises = function* () {
            for (let i = 0; i < count; i++) {
                const url = util.getRandomItem(urls);
                yield page.visit(url);
            }
        }
        const pool = new PromisePool(generatePromises(), maxConcurrent);
        pool.start().then(() => {
            logger.log('Complete');
            process.exit();
        });
    }

})()