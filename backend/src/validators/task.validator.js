const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');

const isMongoId = (value) => {
  if (value && !mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ObjectId');
  }
  return true;
};

const createTaskValidator = [
  param('projectId').custom((val, { req }) => {
    const id = val || req.body.project;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Valid Project ID is required');
    }
    return true;
  }),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be To Do, In Progress, or Done'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO Date string'),
  body('assignee')
    .optional({ nullable: true, checkFalsy: true })
    .custom(isMongoId)
    .withMessage('Assignee must be a valid ObjectId')
];

const updateTaskValidator = [
  param('projectId').custom(isMongoId).withMessage('Invalid project ID'),
  param('taskId').custom(isMongoId).withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be To Do, In Progress, or Done'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO Date string'),
  body('assignee')
    .optional({ nullable: true, checkFalsy: true })
    .custom(isMongoId)
    .withMessage('Assignee must be a valid ObjectId')
];

const getTasksQueryValidator = [
  param('projectId').custom(isMongoId).withMessage('Invalid project ID'),
  query('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Invalid status filter value'),
  query('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority filter value'),
  query('assignee')
    .optional()
    .custom(isMongoId)
    .withMessage('Invalid assignee filter value')
];

const taskParamsValidator = [
  param('projectId').custom(isMongoId).withMessage('Invalid project ID'),
  param('taskId').custom(isMongoId).withMessage('Invalid task ID')
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  getTasksQueryValidator,
  taskParamsValidator
};
