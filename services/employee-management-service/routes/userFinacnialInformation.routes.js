const express = require('express');
const router = express.Router();

const withAuth = require("../authHandler");
const financialInformation = require("../controllers/userFinancialInformation.controller");


router.post(
    '/',
    withAuth.verifyToken,
    withAuth.withAdminRole,
    financialInformation.create
);

router.get(
    '/',
    withAuth.verifyToken,
    withAuth.withAdminManagerRole,
    financialInformation.findAll
);

router.get(
    '/user/:id',
    withAuth.verifyToken,
    financialInformation.findByUserId
);

router.get(
    '/:id',
    withAuth.verifyToken,
    financialInformation.findOne
);

router.put(
    '/:id',
    withAuth.verifyToken,
    withAuth.withAdminRole,
    financialInformation.update
);

module.exports = router;
