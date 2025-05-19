// server/routes/checkout.routes.js
import express from 'express'
import {
  getCheckout,
  findByAppointmentAndPanel,  
  createCheckout,
  updateCheckout
} from '../controllers/checkout.controller.js'

const router = express.Router()

router
  .route('/')
    .post(createCheckout)

router.get('/find', findByAppointmentAndPanel)

router
  .route('/:checkoutId')
    .get(getCheckout)
    .put(updateCheckout)

export default router
