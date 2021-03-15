const path = require('path');
exports.getApiEndpoints = (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'endpoints.json'));
};
