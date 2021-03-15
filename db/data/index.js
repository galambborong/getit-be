const ENV = process.env.NODE_ENV || 'development';

const testData = require('./test-data');
const developmentData = require('./development-data');

const data = {
  test: testData,
  development: developmentData,
  production: developmentData
};

module.exports = data[ENV];
