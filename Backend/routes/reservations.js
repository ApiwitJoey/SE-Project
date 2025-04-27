const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

const {
  getReservation,
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  deleteOrphanReservations
} = require("../controllers/reservations");

// router.delete("/deleteOrphan", protect, authorize("admin"), deleteOrphanReservations); 

// Protect is used to check if the user is logged in
// authorize checks if the user has the required role
router.get("/:id", protect, getReservation);
router.get("/", protect, getReservations);
router.post("/", protect, authorize("admin", "user"), createReservation); // from shops first
router.put("/:id", protect, authorize("admin", "user"), updateReservation);
router.delete("/:id", protect, authorize("admin", "user"), deleteReservation);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - shop
 *         - service
 *         - date
 *       properties:
 *         user:
 *           type: string
 *           format: objectId
 *           description: Reference to the User object.
 *         shop:
 *           type: string
 *           format: objectId
 *           description: Reference to the Shop object.
 *         service:
 *           type: string
 *           format: objectId
 *           description: Reference to the Service object.
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the reservation.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the reservation was created.
 */

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: The reservation managing API
 * /reservations:
 *   get:
 *     summary: Returns the list of all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: The list of reservations
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
 *                 description: The number of reservations returned in the response
 *               data:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reservation'
 *                 description: The array of user objects returned
 *       401:
 *         description: Not log in / Unauthorized
 *       500: 
 *         description: Failed to get list of reservations
 *   post:
 *     summary: Create new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: The reservation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Met reserve limit
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Failed to create reservation
 * /reservations/{id}:
 *   get:
 *     summary: Get a reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation id
 *     responses:
 *       200:
 *         description: The list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not log in / Unauthorized
 *       403:
 *         description: Not log in / Unauthorized
 *       404:
 *         description: No reservation with match id
 *       500: 
 *         description: Failed to get list of reservations
 *   put:
 *     summary: Update a reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: The list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not log in / Unauthorized
 *       404:
 *         description: No reservation with match id
 *       500: 
 *         description: Failed to get list of reservations
 *   delete:
 *     summary: Delete a reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation id
 *     responses:
 *       200:
 *         description: Reservation with match id deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not log in / Unauthorized
 *       404:
 *         description: No reservation with match id
 *       500: 
 *         description: Failed to delete reservation
 */