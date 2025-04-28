const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../server");
const User = require("../../models/User");
const connectDB = require("../../config/db");

let adminToken;
let userToken;
let anotherUser; // User created in beforeEach for unauthorized test
let deleteMeUser;
let userToDelete;

const TEST_ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL,
  password: process.env.TEST_ADMIN_PASSWORD,
};
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD,
};

beforeAll(async () => {
  await connectDB(); // Connect to the database
  const adminRes = await request(app)
    .post("/api/v1/auth/login")
    .send(TEST_ADMIN);
  adminToken = adminRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Delete Tests", () => {
  beforeEach(async () => {
    deleteMeUser = await User.create({
      username: `deleteMePlease_${Math.random().toString(36).substring(2, 7)}`,
      firstname: "Delete",
      lastname: "Me",
      email: `deleteMe${Math.floor(1 + Math.random() * 10000)}@gmail.com`,
      password: "123456",
      telephone: `06${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: "user",
      isBan: false,
      likedShops: [],
    });

    anotherUser = await User.create({
      username: `anotherUser_${Math.random().toString(36).substring(2, 7)}`,
      firstname: "Another",
      lastname: "User",
      email: `AnotherUser${Math.floor(1 + Math.random() * 10000)}@gmail.com`,
      password: "123456",
      telephone: `06${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: "user",
      isBan: false,
      likedShops: [],
    });

    // Log in the TEST_USER to get their token for this test suite
    const userRes = await request(app).post("/api/v1/auth/login").send({
      email: deleteMeUser.email,
      password: "123456",
    });
    // Ensure login was successful before getting token
    if (userRes.status !== 200) {
      throw new Error(
        `User login failed with status ${userRes.status}: ${JSON.stringify(
          userRes.body
        )}`
      );
    }
    userToken = userRes.body.token;
  });

  afterEach(async () => {
    await User.deleteOne({ email: anotherUser.email });
    await User.deleteOne({ email: deleteMeUser.email });
  });

  // Test User Delete Self
  it("should allow a user to delete their own account", async () => {
    // Now testUser is set to the user associated with userToken
    const res = await request(app)
      .delete(`/api/v1/users/${deleteMeUser._id}`) // Use the ID of the user logged in via userToken
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.msg).toBe("Delete successful");
    expect(res.body.data._id).toBe(deleteMeUser._id.toString());

    // Verify the user is deleted
    const deletedUser = await User.findById(deleteMeUser._id);
    expect(deletedUser).toBeNull();
  });

  // Test User Delete Self with Non-existent ID
  it("should return 404 when a user tries to delete a non-existent account", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/v1/users/${nonExistentId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Cannot find User with provided ID");
  });

  // Test Unauthorized (User delete other user)
  it("should return 401 when a user tries to delete another user's account", async () => {
    // Use userToken (representing the logged-in user from beforeEach) to try and delete anotherUser
    const res = await request(app)
      .delete(`/api/v1/users/${anotherUser._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "You are unauthorize to access this information"
    );

    // Verify the other user is NOT deleted
    const existingUser = await User.findById(anotherUser._id);
    expect(existingUser).not.toBeNull();
  });
});

// Describe block for Admin deletion tests
describe("Admin Delete Tests", () => {
  beforeAll(async () => {
    // Log in the TEST_ADMIN to get their token for this test suite
    const adminRes = await request(app).post("/api/v1/auth/login").send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    // Ensure login was successful before getting token
    if (adminRes.status !== 200) {
      throw new Error(
        `Admin login failed with status ${adminRes.status}: ${JSON.stringify(
          adminRes.body
        )}`
      );
    }
    adminToken = adminRes.body.token;
  });

  // Before *each* test in this block: create a temporary user for admin to delete and get admin token
  beforeEach(async () => {
    // Create a user for the admin to delete
    userToDelete = await User.create({
      username: `userToDelete_${Math.random().toString(36).substring(2, 7)}`, // Ensure unique username
      firstname: `User`,
      lastname: "toDelete",
      email: `userToDelete_${Math.random()
        .toString(36)
        .substring(2, 7)}@example.com`, // Ensure unique email
      password: "123456",
      telephone: `09${Math.floor(10000000 + Math.random() * 90000000)}`, // Use a distinct dynamic phone pattern
      role: "user",
      isBan: false,
      likedShops: [],
    });
  });

  afterEach(async () => {
    await User.deleteOne({ email: userToDelete.email });
  });

  // Test Admin delete user with Non-existent ID
  it("should return 404 when an admin tries to delete a non-existent user account", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/v1/users/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Cannot find User with provided ID");
  });

  // Test Admin delete user - Success
  it("should allow an admin to delete a user account", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${userToDelete._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.msg).toBe("Delete successful");
    expect(res.body.data._id).toBe(userToDelete._id.toString());

    // Verify the user is deleted
    const deletedUser = await User.findById(userToDelete._id);
    expect(deletedUser).toBeNull();
  });
});
