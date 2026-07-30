const projectService = require('../services/project.service');
const { successResponse } = require('../utils/apiResponse');

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.user._id, req.body);
    return successResponse(res, 201, 'Project created successfully', { project });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getUserProjects(req.user);
    return successResponse(res, 200, 'Projects retrieved successfully', { projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId, req.user);
    return successResponse(res, 200, 'Project retrieved successfully', { project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.projectId, req.user, req.body);
    return successResponse(res, 200, 'Project updated successfully', { project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const result = await projectService.deleteProject(req.params.projectId, req.user);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await projectService.addMember(req.params.projectId, req.user, userId);
    return successResponse(res, 200, 'Member added successfully', { project });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await projectService.removeMember(
      req.params.projectId,
      req.user,
      req.params.userId
    );
    return successResponse(res, 200, 'Member removed successfully', { project });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
