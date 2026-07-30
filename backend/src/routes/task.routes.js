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

/**
 * @openapi
 * /api/projects/{projectId}/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a task in project
 *     description: Creates a task assigned to project. Requires user to be a project member, creator, or Admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4022
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation failed or invalid assignee
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not a project member
 *       404:
 *         description: Project not found
 *   get:
 *     tags:
 *       - Tasks
 *     summary: List tasks in project
 *     description: Retrieves all tasks within a project. Supports query filtering by status, priority, and assignee.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4022
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [To Do, In Progress, Done]
 *         description: Filter tasks by status
 *       - in: query
 *         name: priority
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter tasks by priority
 *       - in: query
 *         name: assignee
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter tasks by assignee User ObjectId
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not a project member
 *       404:
 *         description: Project not found
 */
router.post('/', createTaskValidator, validate, taskController.createTask);
router.get('/', getTasksQueryValidator, validate, taskController.getTasks);

/**
 * @openapi
 * /api/projects/{projectId}/tasks/{taskId}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get task by ID
 *     description: Retrieves details of a specific task within a project.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4022
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4033
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task or Project not found
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Update task
 *     description: Updates task fields (title, description, status, priority, dueDate, assignee).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4022
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4033
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task or Project not found
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete task
 *     description: Deletes a task from the project.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4022
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4033
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task or Project not found
 */
router.get('/:taskId', taskParamsValidator, validate, taskController.getTaskById);
router.patch('/:taskId', updateTaskValidator, validate, taskController.updateTask);
router.delete('/:taskId', taskParamsValidator, validate, taskController.deleteTask);

module.exports = router;
