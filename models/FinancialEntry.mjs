// models/FinancialEntry.mjs
import mongoose from 'mongoose';

const financialEntrySchema = new mongoose.Schema({
  value: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['in', 'out'], required: true }
});

const FinancialEntry = mongoose.model('FinancialEntry', financialEntrySchema);

export default FinancialEntry;
