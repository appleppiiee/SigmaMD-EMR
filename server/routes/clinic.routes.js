import express from 'express';
import * as clinicController from '../controllers/clinic.controller.js';

const router = express.Router();

// List all clinics
router.get('/', clinicController.listClinics);

// Add a new clinic
router.post('/', clinicController.createClinic);


router.delete('/:id', clinicController.deleteClinic);



export default router;
