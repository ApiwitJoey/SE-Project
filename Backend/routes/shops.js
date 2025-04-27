const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getShop,
  getShops,
  createShop,
  updateShop,
  deleteShop,
} = require("../controllers/shops");

const reservationRouter = require("./reservations");
// US2-4
const serviceRouter = require("./services");

router.use(
  "/:shopId/reservations/",
  protect,
  authorize("admin", "user"),
  reservationRouter
); // Get all reservation from that shop only for admin

// Protect is used to check if the user is logged in
// authorize checks if the user has the required role

/** 
 * @swagger
 * components:
 *   schemas:
 *     Shop:
 *       type: object
 *       required: 
 *         - name
 *         - address
 *         - telephone
 *         - openTime
 *         - closeTime
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the shop
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Shop name
 *         address:
 *           type: string
 *           description: The address of the shop
 *         telephone:
 *           type: string
 *           pattern: '^\d{3}-\d{3}-\d{4}$'
 *           description: The telephone of the shop
 *         openTime:
 *           type: string
 *           format: date-time
 *           description: The open-time of the shop
 *         closeTime:
 *           type: string
 *           format: date-time
 *           description: The close-time of the shop
 *       example:
 *         id: 609bda561452242d88d36e37
 *         name: SABAAI example shop
 *         address: bangkok
 *         telephone: 083-111-2222
 *         openTime: 2025-4-26T17:30:00Z
 *         closeTime: 2025-4-26T22:00:00Z
 *           
*/

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: The shops managing API
 */

/**
 * @swagger
 * /shops:
 *   get:
 *     summary: Returns the list of all the shops
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: The list of the shops
 *         content:
 *           application/json: 
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shop'
 */
router.get("/", getShops);


/**
 * @swagger
 * /shops/{id}:
 *   get:
 *     summary: Get a shop by ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The shop id
 *     responses:
 *       200:
 *         description: The shop description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shop'
 *       404:
 *         description: The shop was not found
 */
router.get("/:id", getShop);

/**
 * @swagger
 * /shops:
 *   post:
 *     summary: Create a new shop
 *     tags: [Shops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shop'
 *     responses:
 *       201:
 *         description: The shop was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shop'
 *       500:
 *         description: Some server error
 */
router.post("/", protect, authorize("admin"), createShop);

/**
 * @swagger
 * /shops/{id}:
 *   put:
 *     summary: Update a shop by the id
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The shop id
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shop'
 *     responses:
 *       200:
 *         description: The shop was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shop'
 *       404:
 *         description: The shop was not found
 *       500:
 *         description: Some error happened
 */
router.put("/:id", protect, authorize("admin"), updateShop);

/**
 * @swagger
 * /shops/{id}:
 *   delete:
 *     summary: Delete the shop by id
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         desciption: The shop id
 *     responses:
 *       200:
 *         description: The shop was deleted
 *       404:
 *         description: The shop was not found
 */
router.delete("/:id", protect, authorize("admin"), deleteShop);

// added feature (US2-4) written by jean (dealing with the services)
router.use(
  "/:shopId/services/",
  protect,
  authorize("admin" , "user"),
  serviceRouter
);

module.exports = router;
