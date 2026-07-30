const { errorResponse } = require('../utils/apiResponse');

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 404, `Route not found - ${req.originalUrl}`);
};

module.exports = notFoundHandler;
