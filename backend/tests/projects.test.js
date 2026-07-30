const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');

let mongoServer;
let token1;
let token2;
let user1Id;
let user2Id;

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

  const user1 = await request(app).post('/api/auth/register').send({
    name: 'User One',
    email: 'user1@example.com',
    password: 'password123'
  });
  token1 = user1.body.data.token;
  user1Id = user1.body.data.user._id;

  const user2 = await request(app).post('/api/auth/register').send({
    name: 'User Two',
    email: 'user2@example.com',
    password: 'password123'
  });
  token2 = user2.body.data.token;
  user2Id = user2.body.data.user._id;
});

describe('Projects API Endpoints', () => {
  it('6. Authenticated user can create project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Project Alpha',
        description: 'First project'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.project.name).toEqual('Project Alpha');
  });

  it('7. User cannot access an unauthorized project', async () => {
    // User 1 creates project
    const projRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Private Project',
        description: 'User 1 only'
      });

    const projectId = projRes.body.data.project._id;

    // User 2 tries to access User 1's project
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.success).toBe(false);
  });
});
