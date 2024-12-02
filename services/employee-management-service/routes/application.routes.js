const express = require('express');
const router = express.Router();

const authHandler = require('../authHandler');
const applicationController = require('../controllers/application.controller.js');

router.get('/', authHandler.verifyToken, authHandler.withAdminManagerRole, applicationController.findAll);
router.post('/', authHandler.verifyToken, applicationController.create);
router.get('/users/:id', authHandler.verifyToken, applicationController.findAllByUserId);
router.get('/departments/:id', authHandler.verifyToken, authHandler.withManagerRole, applicationController.findAllByDeptId);
router.get('/recent', authHandler.verifyToken, applicationController.findAllRecent);
router.get('/departments/:id/recent', authHandler.verifyToken, authHandler.withManagerRole, applicationController.findAllRecentAndDept);
router.get('/users/:id/recent', authHandler.verifyToken, applicationController.findAllRecentAndUser);
router.get('/:id', authHandler.verifyToken, applicationController.findOne);
router.put('/:id', authHandler.verifyToken, authHandler.withAdminManagerRole, applicationController.update);
router.delete('/', authHandler.verifyToken, authHandler.withAdminRole, applicationController.deleteAll);
router.delete('/:id', authHandler.verifyToken, authHandler.withAdminManagerRole, applicationController.delete);
router.delete('/users/:id', authHandler.verifyToken, authHandler.withAdminRole, applicationController.deleteAllByUserId);

module.exports = router;
