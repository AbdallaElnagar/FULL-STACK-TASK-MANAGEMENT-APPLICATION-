const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

class ProjectService {
  async createProject(userId, { name, description }) {
    const project = new Project({
      name,
      description,
      createdBy: userId,
      members: [userId]
    });
    await project.save();
    return await project.populate(['createdBy', 'members']);
  }

  async getUserProjects(user) {
    let query = {};
    if (user.role !== 'Admin') {
      query = { members: user._id };
    }
    const projects = await Project.find(query)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    return projects;
  }

  async getProjectById(projectId, user) {
    const project = await Project.findById(projectId)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role');

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Check membership or Admin
    const isMember = project.members.some((m) => m._id.toString() === user._id.toString());
    if (user.role !== 'Admin' && !isMember) {
      const error = new Error('Access denied: You are not a member of this project');
      error.statusCode = 403;
      throw error;
    }

    return project;
  }

  async updateProject(projectId, user, { name, description }) {
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const isCreator = project.createdBy.toString() === user._id.toString();
    if (user.role !== 'Admin' && !isCreator) {
      const error = new Error('Access denied: Only Admins or the project creator can edit project details');
      error.statusCode = 403;
      throw error;
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();
    return await project.populate(['createdBy', 'members']);
  }

  async deleteProject(projectId, user) {
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const isCreator = project.createdBy.toString() === user._id.toString();
    if (user.role !== 'Admin' && !isCreator) {
      const error = new Error('Access denied: Only Admins or the project creator can delete this project');
      error.statusCode = 403;
      throw error;
    }

    // Delete associated tasks
    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);

    return { message: 'Project and associated tasks deleted successfully' };
  }

  async addMember(projectId, user, targetUserId) {
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const isCreator = project.createdBy.toString() === user._id.toString();
    if (user.role !== 'Admin' && !isCreator) {
      const error = new Error('Access denied: Only Admins or the project creator can add members');
      error.statusCode = 403;
      throw error;
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      const error = new Error('User to add not found');
      error.statusCode = 404;
      throw error;
    }

    const alreadyMember = project.members.some((m) => m.toString() === targetUserId);
    if (alreadyMember) {
      const error = new Error('User is already a member of this project');
      error.statusCode = 400;
      throw error;
    }

    project.members.push(targetUserId);
    await project.save();
    return await project.populate(['createdBy', 'members']);
  }

  async removeMember(projectId, user, targetUserId) {
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const isCreator = project.createdBy.toString() === user._id.toString();
    if (user.role !== 'Admin' && !isCreator) {
      const error = new Error('Access denied: Only Admins or the project creator can remove members');
      error.statusCode = 403;
      throw error;
    }

    // Cannot remove creator
    if (project.createdBy.toString() === targetUserId) {
      const error = new Error('Cannot remove the project creator from members');
      error.statusCode = 400;
      throw error;
    }

    const memberIndex = project.members.findIndex((m) => m.toString() === targetUserId);
    if (memberIndex === -1) {
      const error = new Error('User is not a member of this project');
      error.statusCode = 404;
      throw error;
    }

    project.members.splice(memberIndex, 1);
    await project.save();
    return await project.populate(['createdBy', 'members']);
  }
}

module.exports = new ProjectService();
