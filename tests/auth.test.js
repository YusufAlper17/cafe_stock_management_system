const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    // Sync database before tests
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clean up database before each test
    await db.User.destroy({ where: {}, force: true });
    await db.Store.destroy({ where: {}, force: true });
  });

  afterAll(async () => {
    // Close database connection
    await db.sequelize.close();
  });

  describe('POST /api/auth/login', () => {
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found!');
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 401 for invalid password', async () => {
      // First create a test store
      const store = await db.Store.create({
        store_name: 'Test Store Password Check',
        address: 'Test Address'
      });

      // Create user - password will be auto-hashed by beforeCreate hook
      const user = await db.User.create({
        username: 'testuser_password',
        password: 'password123',
        role: 'admin',
        store_id: store.id
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser_password',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid password!');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const store = await db.Store.create({
        store_name: 'Test Store Register',
        address: 'Test Address Register'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser_register',
          password: 'password123',
          role: 'admin',
          store_id: store.id
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully!');
      expect(response.body.user.username).toBe('newuser_register');
    });

    it('should return 400 for duplicate username', async () => {
      const store = await db.Store.create({
        store_name: 'Test Store Duplicate',
        address: 'Test Address Duplicate'
      });

      // Create first user
      await db.User.create({
        username: 'duplicateuser_test',
        password: 'password123',
        role: 'admin',
        store_id: store.id
      });

      // Try to create second user with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicateuser_test',
          password: 'password123',
          role: 'admin',
          store_id: store.id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already exists!');
    });
  });
});