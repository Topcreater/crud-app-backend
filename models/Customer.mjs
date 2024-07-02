// models/Customer.mjs
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  address: { type: String, required: true }
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
