
const formatDate = function(date) {
    return require('moment').utc(date).local().format('DD-MM-YYYY hh:mm:ss A');
}


module.exports = formatDate