const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { check } = require("express-validator");
const router = express.Router({ mergeParams: true });

const {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/services");


// Protect is used to check if the user is logged in
// authorize checks if the user has the required role

/** 
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the service
 *         shop:
 *           type: string
 *           description: ObjectId reference to the shop
 *           example: 660f4eced3e1a23e4c2c4d7e
 *         service:
 *           type: string
 *           description: ID reference to the service
 *         name:
 *           type: string
 *           description: Name of the service
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the service
 *         targetArea:
 *           type: string
 *           enum:
 *             - Head & Shoulder
 *             - Foot
 *             - Neck-Shoulder-Back
 *             - Chair
 *             - Abdominal
 *             - Hand & Arm
 *             - Leg
 *             - Full Body
 *           description: Target body area for the service
 *         massageType:
 *           type: string
 *           enum:
 *             - Thai
 *             - Swedish
 *             - Oil/Aromatherapy
 *             - Herbal Compress
 *             - Deep Tissue
 *             - Sports
 *             - Office Syndrome
 *             - Shiatsu
 *             - Lomi-Lomi
 *             - Trigger Point
 *             - Others
 *           description: Type of massage technique
 *         details:
 *           type: string
 *           description: Additional details about the service
 *       required:
 *         - service
 *         - name
 *         - price       
*/

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: The services managing API
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Returns the list of all the services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: The list of the services
 *         content:
 *           application/json: 
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get("/", getServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service id
 *     responses:
 *       200:
 *         description: The service description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: The service was not found
 */
router.get("/:id", getService);

/**
 * @swagger
 * /shops/{shopId}/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - targetArea
 *               - massageType
 *             properties:
 *               name:
 *                 type: string
 *                 example: Thai Head Massage
 *               price:
 *                 type: number
 *                 example: 450
 *               targetArea:
 *                 type: string
 *                 enum:
 *                   - Head & Shoulder
 *                   - Foot
 *                   - Neck-Shoulder-Back
 *                   - Chair
 *                   - Abdominal
 *                   - Hand & Arm
 *                   - Leg
 *                   - Full Body
 *                 example: Head & Shoulder
 *               massageType:
 *                 type: string
 *                 enum:
 *                   - Thai
 *                   - Swedish
 *                   - Oil/Aromatherapy
 *                   - Herbal Compress
 *                   - Deep Tissue
 *                   - Sports
 *                   - Office Syndrome
 *                   - Shiatsu
 *                   - Lomi-Lomi
 *                   - Trigger Point
 *                   - Others
 *                 example: Thai
 *               details:
 *                 type: string
 *                 example: A soothing massage technique focused on the head and shoulders.
 *     responses:
 *       201:
 *         description: The service was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request
 */
router.post(
  "/", [
    protect,
    authorize("admin", "user")
  ], 
  createService); // from services first


/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - targetArea
 *               - massageType
 *             properties:
 *               name:
 *                 type: string
 *                 example: Thai Head Massage
 *               price:
 *                 type: number
 *                 example: 450
 *               targetArea:
 *                 type: string
 *                 enum:
 *                   - Head & Shoulder
 *                   - Foot
 *                   - Neck-Shoulder-Back
 *                   - Chair
 *                   - Abdominal
 *                   - Hand & Arm
 *                   - Leg
 *                   - Full Body
 *                 example: Head & Shoulder
 *               massageType:
 *                 type: string
 *                 enum:
 *                   - Thai
 *                   - Swedish
 *                   - Oil/Aromatherapy
 *                   - Herbal Compress
 *                   - Deep Tissue
 *                   - Sports
 *                   - Office Syndrome
 *                   - Shiatsu
 *                   - Lomi-Lomi
 *                   - Trigger Point
 *                   - Others
 *                 example: Thai
 *               details:
 *                 type: string
 *                 example: A soothing massage technique focused on the head and shoulders.
 *     responses:
 *       200:
 *         description: The service was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Service not found
 */
router.put(
  "/:id", 
  [
  protect,
  authorize("admin", "user")
  ],
  updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete the service by id
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         desciption: The service id
 *     responses:
 *       200:
 *         description: The service was deleted
 *       404:
 *         description: The service was not found
 */
router.delete("/:id", protect, authorize("admin", "user"), deleteService);

module.exports = router;
