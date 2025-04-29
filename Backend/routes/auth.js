const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  updateMe,
  logout,
  banUser,
  unbanUser,
  forgotPassword,
  resetPassword,
  validateOtp
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/getme", protect, getMe);
router.put("/getme", protect, updateMe); 
router.put("/ban/:id", protect, authorize("admin"), banUser);
router.put("/unban/:id", protect, authorize("admin"), unbanUser);
router.get("/logout", logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:otp', resetPassword);
router.get('/validate-otp/:resettoken',validateOtp)

module.exports = router;

/**
 * @swagger
 * tags: 
 *   name: Authentication
 *   description: The authentication managing API
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - role
 *               - telephone
 *             properties:
 *               username:
 *                 type: string
 *                 description: The unique username of the user.
 *               firstname:
 *                 type: string
 *                 description: The first name of the user.
 *               lastname:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *               role:
 *                 type: string
 *                 description: The user's role in the application.
 *               telephone:
 *                 type: string
 *                 description: The user's telephone number.
 *     responses:
 *       200:
 *         description: Successfully register new user
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               token:
 *                 type: string
 *                 description: Session token
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               role:
 *                 type: string
 *                 description: The user's role in the application.
 *               username:
 *                 type: string
 *                 description: Username
 *       400:
 *         description: bad request
 * /auth/login:
 *   post:
 *     summary: Log in
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Successfully login
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               token:
 *                 type: string
 *                 description: Session token
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               role:
 *                 type: string
 *                 description: The user's role in the application.
 *               username:
 *                 type: string
 *                 description: Username
 *       400:
 *         description: bad request
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: This user is banned
 * /auth/getme:
 *   get:
 *     summary: Get user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully login
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               data:
 *                 $ref: '#/components/schemas/User'
 *                 description: User's information
 *       400:
 *         description: bad request
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: This user is banned
 *   post:
 *     summary: Update user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The unique username of the user.
 *               firstname:
 *                 type: string
 *                 description: The first name of the user.
 *               lastname:
 *                 type: string
 *                 description: The last name of the user.
 *               telephone:
 *                 type: string
 *                 description: The user's telephone number.
 *     responses:
 *       200:
 *         description: Successfully login
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               token:
 *                 type: string
 *                 description: Session token
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               role:
 *                 type: string
 *                 description: The user's role in the application.
 *               username:
 *                 type: string
 *                 description: Username
 *       400:
 *         description: bad request
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: This user is banned
 * /auth/ban/{id}:
 *   put:
 *     summary: Ban user
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully login
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               token:
 *                 type: string
 *                 description: Session token
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               role:
 *                 type: string
 *                 description: The user's role in the application.
 *               username:
 *                 type: string
 *                 description: Username
 *       400:
 *         description: bad request
 *       401:
 *         description: Invalid credentials / Unauthorized
 *       403:
 *         description: This user is banned
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * /auth/unban/{id}:
 *   put:
 *     summary: Unban user
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully login
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               token:
 *                 type: string
 *                 description: Session token
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               role:
 *                 type: string
 *                 description: The user's role in the application.
 *               username:
 *                 type: string
 *                 description: Username
 *       400:
 *         description: bad request
 *       401:
 *         description: Invalid credentials / Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * /auth/logout:
 *   get:
 *     summary: Log out
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logout
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 * /auth/forgotpassword:
 *   post:
 *     summary: Reset user's password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *     responses:
 *       200:
 *         description: Successfully logout
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               message:
 *                 type: string
 *                 description: Response message
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * /auth/resetpassword/{otp}:
 *   put:
 *     summary: Reset user's password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password otp
 *     responses:
 *       200:
 *         description: Successfull reset password
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               token:
 *                 type: string
 *                 description: Session token
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               role:
 *                 type: string
 *                 description: The user's role in the application.
 *               username:
 *                 type: string
 *                 description: Username
 *       400:
 *         description: bad request
 * /auth/validate-otp/{resettoken}:
 *   get:
 *     summary: Reset user's password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     responses:
 *       200:
 *         description: Successfully login
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Indicates whether the request was successful
 *               message:
 *                 type: string
 *                 description: Response message
 *       400:
 *         description: bad request
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 */