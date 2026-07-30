const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');

let mongoServer;
let token1;
let token2;
let projectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: '7.0.8' } });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});

  const user1 = await request(app).post('/api/auth/register').send({
    name: 'User One',
    email: 'user1@example.com',
    password: 'password123'
  });
  token1 = user1.body.data.token;

  const user2 = await request(app).post('/api/auth/register').send({
    name: 'User Two',
    email: 'user2@example.com',
    password: 'password123'
  });
  token2 = user2.body.data.token;

  const projRes = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      name: 'Task Project',
      description: 'Project for task testing'
    });
  projectId = projRes.body.data.project._id;
});

describe('Tasks API Endpoints', () => {
  it('8. Authorized user can create task', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: 'Task 1',
        description: 'First task',
        priority: 'High',
        status: 'To Do'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.task.title).toEqual('Task 1');
  });

  it('9. Unauthorized user cannot modify task in inaccessible project', async () => {
    // User 1 creates task
    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: 'Task 1',
        priority: 'Medium',
        status: 'To Do'
      });
    const taskId = taskRes.body.data.task._id;

    // User 2 (not member) tries to update task
    const res = await request(app)
      .patch(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token2}`)
      .send({
        status: 'Done'
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.success).toBe(false);
  });

  it('10. Task filtering works by status and priority', async () => {
    await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ title: 'Task Low Todo', priority: 'Low', status: 'To Do' });

    await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ title: 'Task High Done', priority: 'High', status: 'Done' });

    const resFilter = await request(app)
      .get(`/api/projects/${projectId}/tasks?status=Done&priority=High`)
      .set('Authorization', `Bearer ${token1}`);

    expect(resFilter.statusCode).toEqual(200);
    expect(resFilter.body.success).toBe(true);
    expect(resFilter.body.data.tasks.length).toEqual(1);
    expect(resFilter.body.data.tasks[0].title).toEqual('Task High Done');
  });
});
