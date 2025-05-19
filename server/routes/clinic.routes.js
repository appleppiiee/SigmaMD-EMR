// src/routes/clinic.routes.js
import express from 'express';
import {
  listClinics,
  createClinic,
  updateClinic
} from '../controllers/clinic.controller.js';  

const router = express.Router();

// Public CRUD endpoints for clinics
router.get('/',    listClinics);
router.post('/',   createClinic);
router.put('/:id', updateClinic);

export default router;
