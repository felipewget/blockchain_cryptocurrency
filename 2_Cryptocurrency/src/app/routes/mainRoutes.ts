import { Router } from 'express';
import mainController from '../controllers/mainController';

let router: Router = Router();

router.post('/block/mine', mainController.mine)
router.get('/block', mainController.getBlockChain)
router.post('/block/add-transaction', mainController.addTransaction)
router.post('/chain/connect', mainController.connectNode)
router.get('/chain/replace', mainController.replaceChain)


export default router;