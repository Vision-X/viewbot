const util = require('./util/util'),
proxyUtil = require('./proxy/proxy-util'),
logger = require('./logger'),
page = require('./plugins/page');

const argv = require('yargs')
                .usage('Usage: $0 <command> [options]')
                .example('$0 --url pageUrl --count 10', 'visit the page 10 times')
                .alias('c', 'count')
                .help('h')
                .alias('h', 'help')
                .argv;

; (async () => {
    const count = argv.count || 1;
    logger.log('Running for ' + count + ' times');

    if (argv.url) {
        const url = argv.url;

        for (let i = 0; i < count; i++) {
            logger.log('Loading ' + url);
            await page.visit(url);
        }
        process.exit();
    }

})()