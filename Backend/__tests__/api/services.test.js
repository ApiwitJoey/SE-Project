const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server')
const Service = require('../../models/Service');
const Shop = require('../../models/Shop');
const User = require('../../models/User');

const TEST_ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL,
  password: process.env.TEST_ADMIN_PASSWORD
}
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD
}

let adminToken;
let userToken;

// authentication setup
beforeAll(async () => {
  // Login to get tokens once for all tests
  const adminRes = await request(app).post('/api/v1/auth/login').send(TEST_ADMIN);
  adminToken = adminRes.body.token;
  const userRes = await request(app).post('/api/v1/auth/login').send(TEST_USER);
  userToken = userRes.body.token;
});
afterAll(async () => {
  // Close the server and DB connection
  // await app.close();
  await mongoose.connection.close();
});

// testing US2-2 (api test) , verify new service addition
describe('POST /api/v1/shops/:shopId/services', () => {
  // to store all data created for this test
  let testShop;
  const testServices = [];

  beforeAll(async () => {
    // Create test data
    testShop = await Shop.create({
      name: 'Test Shop',
      address: 'Americaaaaa',
      telephone: '0878212231',
      openTime: '11:00',
      closeTime: '13:00'
    });
  });

  afterAll(async () => {
    // Clean up database
    await Service.deleteMany({ shop: { $in: testServices } });
    await Shop.deleteMany({ _id: testShop._id });
  });

  // *** Authentication test ***
  // 1) Admin user with valid token (happy path)
  it('should create a new service', async () => {
    const res = await request(app) // Use app instead of app
      .post(`/api/v1/shops/${testShop._id}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test service 1',
        price: 300,
        targetArea: 'Full Body',
        massageType: 'Thai',
        details: 'this should success wdym'
      })
      .expect(201);
    testServices.push(res.body.data._id); // add this newly created service for testing to remove later
  });
  // 2) Regular user attempt
  it('should not be able to create new service', async () => {
    const res = await request(app)
      .post(`/api/v1/shops/${testShop._id}/services`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test service 2',
        price: 200,
        targetArea: 'Full Body',
        massageType: 'Thai',
        details: 'I mean it\'s for testing so idk'
      })
      .expect(400);
  });

  // *** Shop validation test ***
  // 1) Invalid shop ID
  it('should not be able to create new service because provided shopId doesn\'t exist', async () => {
    const res = await request(app)
      .post(`/api/v1/shops/${6969}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test service 4',
        price: 400,
        targetArea: 'Full Body',
        massageType: 'Thai',
        details: 'Why its keep getting weirder'
      });
    if (res.status !== 404 && res.status !== 500) {
      throw new Error(`Expected 404 or 500 , got ${res.status}`);
    }
  });
});


// testing US2-3 (api test) , API endpoint integration test
describe('PUT /api/v1/services/:id', () => {
  // to store all data created for this test
  let testService;

  beforeAll(async () => {
    // Create test data
    testService = await Service.create({
      name: 'Before test edit',
      price: 300,
      targetArea: 'Full Body',
      massageType: 'Thai',
      details: 'this should success wdym'
    });
  });

  afterAll(async () => {
    // Clean up database
    await Service.deleteMany({ shop: testService._id });
  });

  // *** Authentication test ***
  // 1) Admin user with valid token (happy path)
  it('should edit the existed service', async () => {
    const res = await request(app)
      .put(`/api/v1/services/${testService._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'After test edit'
      })
      .expect(200);
    const updatedService = await Service.findById(testService._id);
    expect(updatedService.name).toBe('After test edit');
    // want to change in database to Before test edit
    await Service.findByIdAndUpdate(
      testService._id,
      { name: 'Before test edit' }
    )
  });
  // 2) User cannot edit
  it('should not be able to edit the existed service', async () => {
    const res = await request(app)
      .put(`/api/v1/services/${testService._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'After test edit',
      });
    if (res.status !== 401 && res.status !== 500) {
      throw new Error(`Expected 401 or 500 , got ${res.status}`);
    }
  });
  // *** Service ID existence test ***
  // 1) Service ID is not existed and should not be able to edit it 
  it('should return 404 if service ID does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app)
      .put(`/api/v1/services/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ghost Update' })
      .expect(404);
  });
});


// testing US2-4 (api test)
describe('DELETE /api/v1/services/:id', () => {
  // to store all data created for this test
  const serviceTesterData = {
    name: 'For test delete',
    price: 300,
    targetArea: 'Full Body',
    massageType: 'Thai',
    details: 'this for delete'
  }
  let testService;

  // *** Authentication test ***
  // 1) Admin user with valid token (happy path)
  it('should delete the existed service', async () => {
    testService = await Service.create(serviceTesterData);
    const res = await request(app)
      .delete(`/api/v1/services/${testService._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    // create again for next test
    testService = await Service.create(serviceTesterData);
  });
  // 2) User cannot delete
  it('should not be able to delete the existed service', async () => {
    const res = await request(app)
      .delete(`/api/v1/services/${testService._id}`)
      .set('Authorization', `Bearer ${userToken}`)
    const service = await Service.findById(testService._id);
    expect(service).not.toBe(null);
    if (res.status !== 401 && res.status !== 404 && res.status !== 500) {
      throw new Error(`Expected 401 or 404 or 500 , got ${res.status}`);
    }
  });

  // *** Service ID existence test ***
  // 1) Service ID is not existed and should not be able to edit it 
  it('should return 404 if service ID does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app)
      .delete(`/api/v1/services/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
