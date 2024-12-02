const express = require('express');
const router = express.Router();

const authHandler = require("../authHandler");
const payment = require("../controllers/payment.controller.js");


router.post(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    payment.create
);

router.get(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    payment.findAll
);

router.get(
    '/year/:id',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    payment.findAllByYear
);

router.get(
    '/job/:id',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    payment.findAllByJobId
);

router.get(
    '/user/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    payment.findAllByUser
);

router.get(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    payment.findOne
);

// Update a payment by payment ID
router.put(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    payment.update
);

// Delete a single payment by payment ID
router.delete(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    payment.delete
);

// Delete all payments
router.delete(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    payment.deleteAll
);

// Delete all payments for a specific job by job ID
router.delete(
    '/job/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    payment.deleteAllByJobId(id)
);

module.exports = router;
