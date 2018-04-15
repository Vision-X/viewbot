const logger = require('../logger');

const Util = {
    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    randomBetween: function(from, to) {
        return Math.floor(Math.random() * to) + from
    },
    getRandomItem: function(array) {
        return array[Util.randomBetween(0, array.length - 1)];
    }
};
module.exports = Util;