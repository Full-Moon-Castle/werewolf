const moment = require('moment');

class DateHelper {
  now() {
    return moment();
  }
  toString(date, mask) {
    return moment(date).format(mask);
  }
}

module.exports = DateHelper;
