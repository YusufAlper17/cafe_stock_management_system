const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

function uniqueName(base) {
  return `${base}_${Date.now()}_${Math.round(Math.random()*100000)}`;
}

describe('Products Tests', () => {
  let authToken;
  let testStore;
  let testUser;
  let username;
  let storeName;

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    // Unique values for user/store
    storeName = uniqueName('TestStore');
    username = uniqueName('testuser');
    // Create store and user
    testStore = await db.Store.create({
      store_name: storeName,
      address: 'Test Address'
    });
    testUser = await db.User.create({
      username,
      password: 'password123',
      role: 'admin',
      store_id: testStore.id
    });
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username,
        password: 'password123'
      });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /api/products', () => {
    it('should return products for authenticated user', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/products');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        price: 10.50,
        cost_price: 5.25,
        stock: 100,
        category: 'Test Category'
      };
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Ürün başarıyla eklendi');
      expect(response.body.product.name).toBe('Test Product');
    });
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product'
          // Missing price
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ürün adı ve satış fiyatı zorunludur');
    });
  });
});