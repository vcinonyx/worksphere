const express = require('express');
const router = express.Router();

const authHandler = require("../authHandler");
const job = require("../controllers/job.controller.js");


router.post(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    job.create
);

router.get(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    job.findAll
);

router.get(
    '/user/:id',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    job.findAllByUserId
);

router.get(
    '/:id',
    authHandler.verifyToken,
    job.findOne
);

router.put(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    job.update
);

router.delete(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    job.delete
);

router.delete(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    job.deleteAll
);

router.delete(
    '/user/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    job.deleteAllByUserId
);

module.exports = router;
