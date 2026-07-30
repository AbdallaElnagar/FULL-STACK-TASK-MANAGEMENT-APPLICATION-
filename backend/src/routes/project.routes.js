const express = require('express');
const router = express.Router({ mergeParams: true });
const projectController = require('../controllers/project.controller');
const {
  createProjectValidator,
  updateProjectValidator,
  projectIdParamValidator,
  addMemberValidator,
  removeMemberValidator
} = require('../validators/project.validator');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

// All project routes require authentication
router.use(protect);

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project
 *     description: Creates a project with the logged-in user set as creator and initial member.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: Project created successfully
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
 *                   example: Project created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags:
 *       - Projects
 *     summary: List accessible projects
 *     description: Retrieves all projects where the authenticated user is a member, creator, or if the user is an Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
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
 *                     projects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createProjectValidator, validate, projectController.createProject);
router.get('/', projectController.getProjects);

/**
 * @openapi
 * /api/projects/{projectId}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project by ID
 *     description: Retrieves project details if the user is a member, creator, or Admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4022
 *     responses:
 *       200:
 *         description: Project details retrieved successfully
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not a member of this project
 *       404:
 *         description: Project not found
 *   patch:
 *     tags:
 *       - Projects
 *     summary: Update project details
 *     description: Updates project name or description. Enforces project access control.
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
 *             $ref: '#/components/schemas/UpdateProjectRequest'
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete project
 *     description: Deletes project and all associated tasks. Only project creator or Admin can delete.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4022
 *     responses:
 *       200:
 *         description: Project deleted successfully
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
 *                   example: Project deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Only creator or Admin can delete
 *       404:
 *         description: Project not found
 */
router.get('/:projectId', projectIdParamValidator, validate, projectController.getProjectById);
router.patch('/:projectId', updateProjectValidator, validate, projectController.updateProject);
router.delete('/:projectId', projectIdParamValidator, validate, projectController.deleteProject);

/**
 * @openapi
 * /api/projects/{projectId}/members:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Add member to project
 *     description: Adds a user to project members list. Only project creator or Admin can add members.
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
 *             $ref: '#/components/schemas/AddMemberRequest'
 *     responses:
 *       200:
 *         description: Member added successfully
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error or user already a member
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Only creator or Admin can manage members
 *       404:
 *         description: Project or User not found
 */
router.post(
  '/:projectId/members',
  addMemberValidator,
  validate,
  projectController.addMember
);

/**
 * @openapi
 * /api/projects/{projectId}/members/{userId}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Remove member from project
 *     description: Removes a user from project members list. Creator cannot be removed.
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d5ecb8b5c9c22b4c8e4011
 *     responses:
 *       200:
 *         description: Member removed successfully
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid parameters or cannot remove creator
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project or Member not found
 */
router.delete(
  '/:projectId/members/:userId',
  removeMemberValidator,
  validate,
  projectController.removeMember
);

// Nested task router integration for /api/projects/:projectId/tasks
const taskRouter = require('./task.routes');
router.use('/:projectId/tasks', taskRouter);

module.exports = router;
