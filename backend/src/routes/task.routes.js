const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/task.controller');
const {
  createTaskValidator,
  updateTaskValidator,
  getTasksQueryValidator,
  taskParamsValidator
} = require('../validators/task.validator');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', createTaskValidator, validate, taskController.createTask);
router.get('/', getTasksQueryValidator, validate, taskController.getTasks);
router.get('/:taskId', taskParamsValidator, validate, taskController.getTaskById);
router.patch('/:taskId', updateTaskValidator, validate, taskController.updateTask);
router.delete('/:taskId', taskParamsValidator, validate, taskController.deleteTask);

module.exports = router;
