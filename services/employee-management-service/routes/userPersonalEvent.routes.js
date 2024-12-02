const express = require('express');
const router = express.Router();

const authHandler = require("../authHandler");
const personalEvent = require("../controllers/userPersonalEvent.controller.js");

// ---------------------------------------------
// User Personal Event Routes
// ---------------------------------------------

// Create a new personal event
router.post(
    '/',
    authHandler.verifyToken,
    personalEvent.create
);

// Retrieve all personal events for a specific user by user ID
router.get(
    '/user/:id',
    authHandler.verifyToken,
    personalEvent.findAllByUserId
);

// Retrieve a single personal event by its ID
router.get(
    '/:id',
    authHandler.verifyToken,
    personalEvent.findOne
);

// Update a personal event by its ID
router.put(
    '/:id',
    authHandler.verifyToken,
    personalEvent.update
);

// Delete a single personal event by its ID
router.delete(
    '/:id',
    authHandler.verifyToken,
    personalEvent.delete
);

// Delete all personal events for a specific user by user ID
router.delete(
    '/user/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    personalEvent.deleteAllByUserId
);

// Delete all personal events
router.delete(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    personalEvent.deleteAll
);

module.exports = router;
