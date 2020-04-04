const dotenv = require('dotenv');

const logger = require('./logger');

class Settings {
  constructor() {
    dotenv.config();

    this.crypto = {
      algorithm: this.getEnviroment('CRYPTO_ALGORITHM'),
      secret: this.getEnviroment('CRYPTO_SECRET'),
    };

    this.database = {
      host: this.getEnviroment('DATABASE_HOST'),
      user: this.getEnviroment('DATABASE_USER'),
      password: this.getEnviroment('DATABASE_PASSWORD'),
      database: this.getEnviroment('DATABASE_NAME'),
    };

    this.servicePort = this.getEnviroment('PORT');

    this.jwt ={
      jwtSecret: this.getEnviroment('SECRET'),
      expiresIn: this.getEnviroment('EXPIRES_IN'),
    };

    this.jwtSecret = this.getEnviroment('SECRET');
  }

  getEnviroment(name) {
    try {
      const value = process.env[name];

      if (!value) {
        throw Error(`An enviroment variable ${name} not foud`);
      }

      return value;
    } catch (error) {
      logger.error(`An error occurred: ${error}`);
      process.exit();
    }
  }
}

module.exports = Settings;
