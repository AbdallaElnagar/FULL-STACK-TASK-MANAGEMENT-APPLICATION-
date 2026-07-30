require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const { connectDB, disconnectDB } = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Seeding users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      role: 'Admin'
    });

    const memberUser = await User.create({
      name: 'Member User',
      email: process.env.MEMBER_EMAIL || 'member@example.com',
      password: process.env.MEMBER_PASSWORD || 'Member123!',
      role: 'Member'
    });

    const devUser = await User.create({
      name: 'Alice Developer',
      email: 'alice@example.com',
      password: 'Password123!',
      role: 'Member'
    });

    console.log('Seeding projects...');
    const project1 = await Project.create({
      name: 'Q3 Enterprise Product Launch',
      description: 'Main product launch initiative for Q3 including frontend, backend, and DevOps milestones.',
      createdBy: adminUser._id,
      members: [adminUser._id, memberUser._id, devUser._id]
    });

    const project2 = await Project.create({
      name: 'Internal Developer Tools',
      description: 'Building internal CLI and dashboard tools for dev productivity.',
      createdBy: memberUser._id,
      members: [memberUser._id, devUser._id]
    });

    console.log('Seeding tasks...');
    await Task.create([
      {
        title: 'Design Database Schema for Auth',
        description: 'Define User, Project, and Task mongoose models with proper indexes and relations.',
        status: 'Done',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 3),
        creator: adminUser._id,
        assignee: memberUser._id,
        project: project1._id
      },
      {
        title: 'Implement JWT Authentication Endpoints',
        description: 'Build register, login, and me endpoints with password hashing and validation.',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 5),
        creator: adminUser._id,
        assignee: memberUser._id,
        project: project1._id
      },
      {
        title: 'Build Interactive React Task Board UI',
        description: 'Develop full drag-and-drop or column layout task board with filtering options.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 7),
        creator: adminUser._id,
        assignee: devUser._id,
        project: project1._id
      },
      {
        title: 'Write Jest Integration Tests',
        description: 'Add tests for auth, project access control, and task filtering.',
        status: 'Done',
        priority: 'Low',
        dueDate: new Date(Date.now() + 86400000 * 2),
        creator: memberUser._id,
        assignee: memberUser._id,
        project: project2._id
      }
    ]);

    console.log('----------------------------------------------------');
    console.log('Database Seeded Successfully!');
    console.log('Admin Credentials:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
    console.log('Member Credentials:');
    console.log(`  Email: ${memberUser.email}`);
    console.log(`  Password: ${process.env.MEMBER_PASSWORD || 'Member123!'}`);
    console.log('----------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
