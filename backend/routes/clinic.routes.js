const express = require('express');
const controller = require('../controllers/clinic.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const admin = [requireAuth, requireRole('admin')];
const pasien = [requireAuth, requireRole('pasien')];

router.get('/doctors', controller.doctors);
router.post('/doctors', admin, controller.createDoctor);
router.put('/doctors/:id', admin, controller.updateDoctor);
router.delete('/doctors/:id', admin, controller.deleteDoctor);
router.get('/schedules', controller.schedules);
router.post('/schedules', admin, controller.createSchedule);
router.put('/schedules/:id', admin, controller.updateSchedule);
router.delete('/schedules/:id', admin, controller.deleteSchedule);
router.get('/knowledge', controller.knowledge);
router.post('/knowledge', admin, controller.createKnowledge);
router.put('/knowledge/:id', admin, controller.updateKnowledge);
router.delete('/knowledge/:id', admin, controller.deleteKnowledge);
router.get('/appointments', admin, controller.appointments);
router.get('/appointments/mine', pasien, controller.myAppointments);
router.post('/appointments', pasien, controller.createAppointment);
router.patch('/appointments/:id/status', admin, controller.updateAppointmentStatus);
router.patch('/appointments/:id/reschedule', admin, controller.rescheduleAppointment);
router.get('/dashboard', admin, controller.dashboard);

module.exports = router;
