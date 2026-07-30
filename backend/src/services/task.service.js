const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

class TaskService {
  async checkProjectAccess(projectId, user) {
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const isMember = project.members.some((m) => m.toString() === user._id.toString());
    if (user.role !== 'Admin' && !isMember) {
      const error = new Error('Access denied: You do not have access to this project');
      error.statusCode = 403;
      throw error;
    }

    return project;
  }

  async createTask(projectId, user, { title, description, status, priority, dueDate, assignee }) {
    await this.checkProjectAccess(projectId, user);

    if (assignee) {
      const assigneeUser = await User.findById(assignee);
      if (!assigneeUser) {
        const error = new Error('Assignee user not found');
        error.statusCode = 404;
        throw error;
      }
    }

    const task = new Task({
      title,
      description: description || '',
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      creator: user._id,
      assignee: assignee || null,
      project: projectId
    });

    await task.save();
    return await task.populate([
      { path: 'creator', select: 'name email role' },
      { path: 'assignee', select: 'name email role' },
      { path: 'project', select: 'name' }
    ]);
  }

  async getTasks(projectId, user, filters = {}) {
    await this.checkProjectAccess(projectId, user);

    const query = { project: projectId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.assignee) {
      query.assignee = filters.assignee;
    }

    const tasks = await Task.find(query)
      .populate('creator', 'name email role')
      .populate('assignee', 'name email role')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    return tasks;
  }

  async getTaskById(projectId, taskId, user) {
    await this.checkProjectAccess(projectId, user);

    const task = await Task.findOne({ _id: taskId, project: projectId })
      .populate('creator', 'name email role')
      .populate('assignee', 'name email role')
      .populate('project', 'name');

    if (!task) {
      const error = new Error('Task not found in this project');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async updateTask(projectId, taskId, user, updates) {
    await this.checkProjectAccess(projectId, user);

    const task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) {
      const error = new Error('Task not found in this project');
      error.statusCode = 404;
      throw error;
    }

    if (updates.assignee) {
      const assigneeUser = await User.findById(updates.assignee);
      if (!assigneeUser) {
        const error = new Error('Assignee user not found');
        error.statusCode = 404;
        throw error;
      }
    }

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'assignee'];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });

    await task.save();
    return await task.populate([
      { path: 'creator', select: 'name email role' },
      { path: 'assignee', select: 'name email role' },
      { path: 'project', select: 'name' }
    ]);
  }

  async deleteTask(projectId, taskId, user) {
    await this.checkProjectAccess(projectId, user);

    const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });
    if (!task) {
      const error = new Error('Task not found in this project');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Task deleted successfully' };
  }
}

module.exports = new TaskService();
