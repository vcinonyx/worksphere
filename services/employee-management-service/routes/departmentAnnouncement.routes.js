const express = require('express');
const router = express.Router();

const authHandler = require('../authHandler')

const departmentAnnouncement = require("../controllers/departmentAnnouncement.controller.js");

router.post('/', authHandler.verifyToken, authHandler.withAdminManagerRole, departmentAnnouncement.create);
router.get('/', authHandler.verifyToken, departmentAnnouncement.findAll)
router.get('/recent', authHandler.verifyToken, authHandler.withAdminRole, departmentAnnouncement.findAllRecent)
router.get('/recent/department/:id', authHandler.verifyToken, departmentAnnouncement.findAllRecentByDeptId)
router.get('/department/:id', authHandler.verifyToken, departmentAnnouncement.findAllByDeptId);
router.get('/:id', authHandler.verifyToken, departmentAnnouncement.findOne);
router.delete('/:id', authHandler.verifyToken, authHandler.withAdminManagerRole, departmentAnnouncement.delete);
router.delete('/department/:id', authHandler.verifyToken, authHandler.withAdminManagerRole, departmentAnnouncement.deleteAllByDeptId);

module.exports = router;
