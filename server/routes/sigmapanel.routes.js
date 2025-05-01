import express from 'express'
import sigmapanelCtrl from '../controllers/sigmapanel.controller.js' 
const router = express.Router()
router.route('/api/sigmapanels').post(sigmapanelCtrl.create)
router.route('/api/sigmapanels').get(sigmapanelCtrl.list)
router.param('sigmapanelId', sigmapanelCtrl.sigmapanelByID)
router.route('/api/sigmapanels/:sigmapanelId').get(sigmapanelCtrl.read)
router.route('/api/sigmapanels/:sigmapanelId').put(sigmapanelCtrl.update)


export default router


