import express from 'express';
import * as patientController from '../controllers/patients.controller.js';

const router = express.Router();

router.get('/', patientController.listPatients);
router.post('/', patientController.createPatient);
router.get('/:id', patientController.getPatient);
router.put('/:id', patientController.updatePatient);

export default router;
