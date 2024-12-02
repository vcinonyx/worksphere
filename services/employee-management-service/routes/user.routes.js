const express = require('express');
const router = express.Router();

const authHandler = require("../authHandler");
const user = require("../controllers/user.controller.js");


router.post(
    '/',
    user.create
);

router.get(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    user.findAll
);

router.get(
    '/total',
    authHandler.verifyToken,
    authHandler.withAdminManagerRole,
    user.findTotal
);

router.get(
    '/total/department/:id',
    authHandler.verifyToken,
    authHandler.withManagerRole,
    user.findTotalByDept
);

router.get(
    '/department/:id',
    authHandler.verifyToken,
    user.findAllByDeptId
);

router.get(
    '/:id',
    authHandler.verifyToken,
    user.findOne
);

router.put(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    user.update
);

router.put(
    '/changePassword/:id',
    authHandler.verifyToken,
    user.changePassword
);

router.delete(
    '/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    user.delete
);

router.delete(
    '/',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    user.deleteAll
);

router.delete(
    '/department/:id',
    authHandler.verifyToken,
    authHandler.withAdminRole,
    user.deleteAllByDeptId
);

module.exports = router;
