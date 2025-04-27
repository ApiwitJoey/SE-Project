const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Service = require('../../models/Service');
const Shop = require('../../models/Shop');

const TEST_ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL,
  password: process.env.TEST_ADMIN_PASSWORD
};
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD
};

let adminToken;
let userToken;
let testShop;
const testServices = [];

beforeAll(async () => {
  const adminRes = await request(app).post('/api/v1/auth/login').send(TEST_ADMIN);
  adminToken = adminRes.body.token;
  const userRes = await request(app).post('/api/v1/auth/login').send(TEST_USER);
  userToken = userRes.body.token;

  testShop = await Shop.create({
    name: 'Test Shop',
    address: 'Test Address',
    telephone: '0123456789',
    openTime: '09:00',
    closeTime: '17:00',
  });
});

afterAll(async () => {
  // Only clean up the test data we created
  if (testServices.length > 0) {
    await Service.deleteMany({ _id: { $in: testServices } });
  }
  if (testShop) {
    await Shop.deleteOne({ _id: testShop._id });
  }
  await mongoose.connection.close();
});


describe('POST /api/v1/shops/:shopId/services', () => {
  it('should create a new service', async () => {
    const res = await request(app)
      .post(`/api/v1/shops/${testShop._id}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Service 1',
        price: 200,
        targetArea: 'Foot',
        massageType: 'Thai',
        details: 'Testing service create'
      })
      .expect(201);
    testServices.push(res.body.data._id);
  });
/*
  it('should decode HTML entities in creation', async () => {
    const res = await request(app)
      .post(`/api/v1/shops/${testShop._id}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test &amp; Service',
        price: 100,
        targetArea: 'Head &amp; Shoulder',
        massageType: 'Deep &amp; Tissue',
        details: 'Test details'
      })
      .expect(201);
    
    expect(res.body.data.name).toBe('Test & Service');
    expect(res.body.data.targetArea).toBe('Head & Shoulder');
    testServices.push(res.body.data._id);
  });
*/

  it('should return validation errors for invalid input', async () => {
    const res = await request(app)
      .post(`/api/v1/shops/${testShop._id}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({}) // empty body should trigger validation errors
      .expect(400);
    expect(res.body.errors).toBeDefined();
  });



  it('should fail if normal user tries to create', async () => {
    const res = await request(app)
      .post(`/api/v1/shops/${testShop._id}/services`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Service 2',
        price: 250,
        targetArea: 'Full Body',
        massageType: 'Swedish',
        details: 'Normal user create'
      });
    expect([400, 401]).toContain(res.status);
  });

  it('should fail to create with invalid shopId', async () => {
    const res = await request(app)
      .post(`/api/v1/shops/invalidid/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Bad ID',
        price: 100,
        targetArea: 'Hand & Arm',
        massageType: 'Deep Tissue',
        details: 'Invalid ID test'
      });
    expect([400, 500]).toContain(res.status);
  });

  it('should fail if shop does not exist', async () => {
    const fakeShopId = new mongoose.Types.ObjectId();
    await request(app)
      .post(`/api/v1/shops/${fakeShopId}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Ghost Shop',
        price: 300,
        targetArea: 'Neck-Shoulder-Back',
        massageType: 'Oil/Aromatherapy',
        details: 'Testing non existing shop'
      })
      .expect(404);
  });
});

describe('GET /api/v1/shops/:shopId/services', () => {
  it('should get services for specific shop', async () => {
    const res = await request(app)
      .get(`/api/v1/shops/${testShop._id}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
  });
});

describe('PUT /api/v1/services/:id', () => {
  let service;

  beforeAll(async () => {
    service = await Service.create({
      name: 'Original Name',
      price: 100,
      targetArea: 'Chair',
      massageType: 'Sports',
      details: 'Details here',
      shop: testShop._id
    });
    testServices.push(service._id);
  });

  it('should update the service', async () => {
    await request(app)
      .put(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })
      .expect(200);
  });

  it('should fail if normal user tries to update', async () => {
    const res = await request(app)
      .put(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'User Update' });
    expect([401, 500]).toContain(res.status);
  });

  it('should fail with invalid id format', async () => {
    const res = await request(app)
      .put('/api/v1/services/invalidid')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Invalid Update' });
    expect([400, 500]).toContain(res.status);
  });

  it('should return 404 if service not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app)
      .put(`/api/v1/services/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ghost Update' })
      .expect(404);
  });

  it('should succeed even with missing fields', async () => {
    await request(app)
      .put(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 400 })
      .expect(200);
  });
});

describe('DELETE /api/v1/services/:id', () => {
  let service;

  beforeEach(async () => {
    service = await Service.create({
      name: 'Service To Delete',
      price: 120,
      targetArea: 'Hand & Arm',
      massageType: 'Office Syndrome',
      details: 'For delete testing',
      shop: testShop._id
    });
    testServices.push(service._id);
  });

  it('should delete the service', async () => {
    await request(app)
      .delete(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should handle errors during deletion', async () => {
    const mockError = new Error('Database error');
    const originalDeleteOne = Service.prototype.deleteOne;
    Service.prototype.deleteOne = jest.fn().mockRejectedValue(mockError);

    const service = await Service.create({
      name: 'Error Test',
      price: 100,
      shop: testShop._id
    });
    testServices.push(service._id);

    const res = await request(app)
      .delete(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(500);

    expect(res.body.message).toBe('Cannot delete Service');
    Service.prototype.deleteOne = originalDeleteOne;
  });

  it('should not allow normal user to delete', async () => {
    const res = await request(app)
      .delete(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect([401, 404, 500]).toContain(res.status);
  });

  it('should fail with invalid id format', async () => {
    const res = await request(app)
      .delete('/api/v1/services/invalidid')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([400, 500]).toContain(res.status);
  });

  it('should return 404 if service not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app)
      .delete(`/api/v1/services/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});

describe('GET /api/v1/services/:id', () => {
  let service;

  beforeAll(async () => {
    service = await Service.create({
      name: 'Service Fetch',
      price: 350,
      targetArea: 'Neck-Shoulder-Back',
      massageType: 'Shiatsu',
      details: 'Fetch testing',
      shop: testShop._id
    });
    testServices.push(service._id);
  });

  it('should fetch the service', async () => {
    await request(app)
      .get(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should populate shop information without _id', async () => {
    const res = await request(app)
      .get(`/api/v1/services/${service._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    expect(res.body.data.shop).toBeDefined();
    expect(res.body.data.shop._id).toBeUndefined();
  });

  it('should return 404 if service not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app)
      .get(`/api/v1/services/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 500 if service id invalid', async () => {
    await request(app)
      .get(`/api/v1/services/invalidid`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(500);
  });

  it('should return 500 if findById throws error', async () => {
    const originalFindById = Service.findById;
    Service.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('Forced Error'))
    });

    await request(app)
      .get(`/api/v1/services/anyid`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(500);

    Service.findById = originalFindById;
  });
});

describe('GET /api/v1/services', () => {
  it('should fetch all services', async () => {
    const res = await request(app)
      .get('/api/v1/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 500 if find throws error', async () => {
    const originalFind = Service.find;
    Service.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('Forced Error'))
    });

    await request(app)
      .get('/api/v1/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(500);

    Service.find = originalFind;
  });
});

it('should return the same text for null, undefined, or empty string input', () => {
  // Test for null
  expect(decodeHtmlEntities(null)).toBe(null);
  
  // Test for undefined
  expect(decodeHtmlEntities(undefined)).toBe(undefined);
  
  // Test for an empty string
  expect(decodeHtmlEntities('')).toBe('');
});