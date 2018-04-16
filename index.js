const util = require('./util/util');

const argv = require('yargs')
                .usage('Usage: $0 <command> [options]')
                .example('$0 --url pageUrl --count 10', 'visit the page 10 times')
                .alias('c', 'count')
                .help('h')
                .alias('h', 'help')
                .argv;

; (async () => {
    const count = argv.count || 1;
    if (argv.url) {
        page = require('./plugins/page');

        for (let i = 0; i < count; i++) {
            await page.visit(argv.url)
        }
    }

})()