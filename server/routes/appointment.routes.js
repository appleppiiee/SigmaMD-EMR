import express from 'express';
import * as appointmentCtrl from '../controllers/appointment.controller.js';

const router = express.Router();

// GET    /api/appointments
router.get('/', appointmentCtrl.listAppointments);

// POST   /api/appointments
router.post('/', appointmentCtrl.createAppointment);

// GET    /api/appointments/:id
router.get('/:id', appointmentCtrl.getAppointment);

// PUT    /api/appointments/:id
router.put('/:id', appointmentCtrl.updateAppointment);


export default router;
