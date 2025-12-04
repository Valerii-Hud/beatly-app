import { Router } from 'express';
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from '../controller/admin.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protectRoute, requireAdmin);

// Security routes:
router.get('/check', checkAdmin);

// Songs routes:
router.post('/songs', createSong);
router.delete('/songs/:id', deleteSong);

// Albums routes:
router.post('/albums', createAlbum);
router.delete('/albums/:id', deleteAlbum);

export default router;
