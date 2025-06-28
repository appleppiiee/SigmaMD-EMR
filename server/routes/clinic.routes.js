// src/routes/clinic.routes.js
import express from 'express';
import {
  listClinics,
  createClinic,
  updateClinic,
  signupCreateClinic
} from '../controllers/clinic.controller.js';  

const router = express.Router();

// Special signup endpoint: ensures default clinic exists
router.post('/signup', signupCreateClinic);

// Public CRUD endpoints for clinics
router.get('/',    listClinics);
router.post('/',   createClinic);
router.put('/:id', updateClinic);

export default router;
