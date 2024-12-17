const express = require('express');
const router = express.Router();

const authHandler = require('../authHandler');
const departmentController = require('../controllers/department.controller.js');

router.post('/', authHandler.verifyToken, authHandler.withAdminRole, departmentController.create);
router.get('/', authHandler.verifyToken, authHandler.withAdminManagerRole, departmentController.findAll);
router.get('/:id', authHandler.verifyToken, departmentController.findOne);
router.put('/:id', authHandler.verifyToken, authHandler.withAdminManagerRole, departmentController.update);
router.delete('/:id', authHandler.verifyToken, authHandler.withAdminRole, departmentController.delete);
router.delete('/', authHandler.verifyToken, authHandler.withAdminRole, departmentController.deleteAll);

module.exports = router;
