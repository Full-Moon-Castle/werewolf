const crypto = require('crypto');
const Settings = require('../config/settings');

class CryptoHelper {
  constructor() {
    this.settings = new Settings();
  }

  encrypt(text) {
    return crypto
        .createHmac(this.settings.crypto.algorithm, this.settings.crypto.secret)
        .update(text)
        .digest('hex');
  }
};

module.exports = CryptoHelper;
