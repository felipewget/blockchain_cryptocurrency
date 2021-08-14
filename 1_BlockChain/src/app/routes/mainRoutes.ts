import { Router } from 'express';
import mainController from '../controllers/mainController';

let router: Router = Router();

router.post('/block/mine', mainController.mine)
router.get('/block', mainController.getBlockChain)

export default router;