// routes/contractRoutes.mjs
import express from 'express';
import { createContract, getContracts, getContract, updateContract, deleteContract } from '../controllers/contractController.mjs';

const router = express.Router();

router.post('/contracts', createContract);
router.get('/contracts', getContracts);
router.get('/contracts/:id', getContract);
router.put('/contracts/:id', updateContract);
router.delete('/contracts/:id', deleteContract);

export default router;
