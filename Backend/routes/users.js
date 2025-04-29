const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const { getUsers, getUser, deleteUser } = require("../controllers/users");

router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, getUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username of the user
 *         firstname:
 *           type: string
 *           description: First name of the user
 *         lastname:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *           default: user
 *           description: Role of the user, can be user or admin
 *         password:
 *           type: string
 *           description: Password of the user, stored securely (not visible)
 *           minLength: 6
 *         telephone:
 *           type: string
 *           description: Telephone number of the user
 *           pattern: ^\\+?[0-9\\s\\-\\(\\)]{7,16}$
 *         resetPasswordToken:
 *           type: string
 *           description: Token used for resetting the user's password
 *         resetPasswordExpire:
 *           type: string
 *           format: date-time
 *           description: Expiration time of the reset password token
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation
 *         isBan:
 *           type: boolean
 *           description: Specifies if the user is banned
 *           default: false
 *         likedShops:
 *           type: array
 *           items:
 *             type: string
 *             description: Array of shop IDs liked by the user
 *       required:
 *         - username
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *         - telephone
 *         - isBan
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 * /users:
 *   get:
 *     summary: Returns the list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               msg:
 *                 type: string
 *                 description: Message describing the result of the request
 *               count:
 *                 type: integer
 *                 description: The number of users returned in the response
 *               data:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *                 description: The array of user objects returned
 *       400: 
 *         description: Failed to get list of users
 *       401:
 *         description: Not log in / Unauthorized
 *       403:
 *         description: Not admin
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The users with id
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               msg:
 *                 type: string
 *                 description: Message describing the result of the request
 *               data:
 *                 $ref: '#/components/schemas/User'
 *                 description: User data with match id
 *       400: 
 *         description: Failed to get user
 *       401:
 *         description: Not log in / Unauthorized
 *   delete:
 *     summary: Delete user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The users with id
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               msg:
 *                 type: string
 *                 description: Message describing the result of the request
 *               data:
 *                 $ref: '#/components/schemas/User'
 *                 description: User data with match id
 *       400: 
 *         description: Failed to delete users
 *       401:
 *         description: Not log in / Unauthorized
 */