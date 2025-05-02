import express from 'express'
import {
  listCheckouts,
  getCheckout,
  createCheckout,
  updateCheckout
} from '../controllers/checkout.controller.js'

const router = express.Router()

router
  .route('/')
    .get(listCheckouts)
    .post(createCheckout)

router
  .route('/:checkoutId')
    .get(getCheckout)
    .put(updateCheckout)

export default router
