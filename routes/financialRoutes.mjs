// routes/financialRoutes.mjs
import express from 'express';
import { createEntry, getEntries, getEntry, updateEntry, deleteEntry } from '../controllers/financialController.mjs';

const router = express.Router();

router.post('/entries', createEntry);
router.get('/entries', getEntries);
router.get('/entries/:id', getEntry);
router.put('/entries/:id', updateEntry);
router.delete('/entries/:id', deleteEntry);

export default router;
