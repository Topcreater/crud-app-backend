// models/Contract.mjs
import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  contractName: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  hourlyRate: { type: Number, required: true },
  contractedMonthlyHours: { type: Number, required: true }
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
