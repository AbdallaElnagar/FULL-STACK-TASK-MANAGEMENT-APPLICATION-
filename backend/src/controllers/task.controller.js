const taskService = require('../services/task.service');
const { successResponse } = require('../utils/apiResponse');

const createTask = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.project;
    const task = await taskService.createTask(projectId, req.user, req.body);
    return successResponse(res, 201, 'Task created successfully', { task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.query.projectId;
    const { status, priority, assignee } = req.query;
    const tasks = await taskService.getTasks(projectId, req.user, {
      status,
      priority,
      assignee
    });
    return successResponse(res, 200, 'Tasks retrieved successfully', { tasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(projectId, taskId, req.user);
    return successResponse(res, 200, 'Task retrieved successfully', { task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const task = await taskService.updateTask(projectId, taskId, req.user, req.body);
    return successResponse(res, 200, 'Task updated successfully', { task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const result = await taskService.deleteTask(projectId, taskId, req.user);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
