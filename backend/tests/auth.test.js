const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

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
});

describe('Auth API Endpoints', () => {
  it('1. User registration succeeds with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty('email', 'john@example.com');
    expect(res.body.data.user.role).toEqual('Member');
    expect(res.body.data.user).not.toHaveProperty('password');
    expect(res.body.data).toHaveProperty('token');
  });

  it('2. Duplicate email registration fails with 409 Conflict', async () => {
    await User.create({
      name: 'Existing User',
      email: 'john@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'John Clone',
      email: 'john@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
  });

  it('3. Login succeeds with valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'jane@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('4. Login fails with invalid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'jane@example.com',
      password: 'wrongpassword'
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('5. Protected route /api/auth/me rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
