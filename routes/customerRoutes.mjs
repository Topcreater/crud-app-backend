// routes/customerRoutes.mjs
import express from 'express';
import { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.mjs';

const router = express.Router();

router.post('/customers', createCustomer);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

export default router;
