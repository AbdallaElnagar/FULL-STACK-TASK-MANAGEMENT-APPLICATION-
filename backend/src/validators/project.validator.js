const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const isMongoId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ObjectId');
  }
  return true;
};

const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Project name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const updateProjectValidator = [
  param('projectId').custom(isMongoId).withMessage('Invalid project ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Project name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const projectIdParamValidator = [
  param('projectId').custom(isMongoId).withMessage('Invalid project ID')
];

const addMemberValidator = [
  param('projectId').custom(isMongoId).withMessage('Invalid project ID'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .custom(isMongoId)
    .withMessage('Invalid user ID')
];

const removeMemberValidator = [
  param('projectId').custom(isMongoId).withMessage('Invalid project ID'),
  param('userId').custom(isMongoId).withMessage('Invalid target user ID')
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  projectIdParamValidator,
  addMemberValidator,
  removeMemberValidator
};
