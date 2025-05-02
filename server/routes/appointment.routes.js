// routes/appointment.routes.js
import express from 'express';
import {
  listAppointments,
  createAppointment,
  getAppointment,
  updateAppointment
} from '../controllers/appointment.controller.js';

const router = express.Router();

router
  .route('/')
    .get(listAppointments)
    .post(createAppointment);

router
  .route('/:appointmentId')
    .get(getAppointment)
    .put(updateAppointment);

export default router;
