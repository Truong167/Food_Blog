const moment = require('moment')

const formatDate = function(date) {
    return moment(date).format('DD-MM-YYYY HH:mm:ss');
}


module.exports = formatDate