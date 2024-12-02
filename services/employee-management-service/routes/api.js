const express = require('express');

const router = express.Router();

const userRouter = require('./user.routes');
const departmentRouter = require('./department.routes');
const announcementRouter = require('./departmentAnnouncement.routes');
const jobRouter = require('./job.routes');
const paymentRouter = require('./payment.routes');
const applicationRouter = require('./application.routes');
const eventRouter = require('./userPersonalEvent.routes');
const personalInfoRouter = require('./userPersonalInformation.routes');
const financialInfoRouter = require('./userFinacnialInformation.routes')

router.use('/personal/info', personalInfoRouter)
router.use('/personal/financial-info', financialInfoRouter)
router.use('/users', userRouter)
router.use('/departments', departmentRouter)
router.use('/departments/announcements', announcementRouter)
router.use('/jobs', jobRouter)
router.use('/payments', paymentRouter)
router.use('/applications', applicationRouter)
router.use('/events', eventRouter)

module.exports = router;
