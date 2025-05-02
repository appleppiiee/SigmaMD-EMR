// src/routes/sigmapanel.routes.js
import express from 'express';
import {
  listSigmapanels,
  createSigmapanel,
  getSigmapanel,
  updateSigmapanel
} from '../controllers/sigmapanel.controller.js';

const router = express.Router();

// GET /api/sigmapanels
// POST /api/sigmapanels
router
  .route('/')
  .get(listSigmapanels)
  .post(createSigmapanel);

// GET /api/sigmapanels/:id
// PUT /api/sigmapanels/:id
router
  .route('/:id')
  .get(getSigmapanel)
  .put(updateSigmapanel);

export default router;
