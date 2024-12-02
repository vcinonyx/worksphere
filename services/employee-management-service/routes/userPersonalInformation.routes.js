const express = require('express');
const router = express.Router();

const authHandler = require("../authHandler");
const personalInformation = require("../controllers/userPersonalInformation.controller.js");

router.post(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    personalInformation.create
);

router.get(
    '/user/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    personalInformation.findAllByUserId
);

router.get(
    '/:id',
    authHandler.verifyToken,
    personalInformation.findOne
);

router.put(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    personalInformation.update
);

router.delete(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    personalInformation.delete
);

router.delete(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    personalInformation.deleteAll
);

module.exports = router;
