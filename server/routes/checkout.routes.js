import express from 'express';
import checkoutCtrl from '../controllers/checkout.controller.js';  

const router = express.Router();

router.route('/api/checkouts').post(checkoutCtrl.create); 

router.route('/api/checkouts').get(checkoutCtrl.list); 

router.param('checkoutId', checkoutCtrl.checkoutByID);

router.route('/api/checkouts/:checkoutId')
  .get(checkoutCtrl.read)      
  .put(checkoutCtrl.update) ;

export default router;
