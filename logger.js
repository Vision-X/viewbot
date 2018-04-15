const Logger = {
    log: (...messages) => {
        const timestamp = (new Date()).toISOString();
        console.log(timestamp, ...messages);
    },
    error: (...messages) => {
        const timestamp = (new Date()).toISOString();
        console.error(timestamp, ...messages);
    }
}
module.exports = Logger