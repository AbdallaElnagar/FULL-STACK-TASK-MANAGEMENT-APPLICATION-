const { errorResponse } = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `User role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};

module.exports = { authorize };
