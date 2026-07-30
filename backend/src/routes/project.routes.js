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

router.post('/', createProjectValidator, validate, projectController.createProject);
router.get('/', projectController.getProjects);

router.get('/:projectId', projectIdParamValidator, validate, projectController.getProjectById);
router.patch('/:projectId', updateProjectValidator, validate, projectController.updateProject);
router.delete('/:projectId', projectIdParamValidator, validate, projectController.deleteProject);

// Member management routes
router.post(
  '/:projectId/members',
  addMemberValidator,
  validate,
  projectController.addMember
);
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
