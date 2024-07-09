import mongoose from 'mongoose';
import Task from './Task.mjs';

const contractSchema = new mongoose.Schema({
  contractName: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  hourlyRate: { type: Number, required: true },
  contractedMonthlyHours: { type: Number, required: true }
}, { timestamps: true });

contractSchema.pre('remove', async function(next) {
  try {
    await Task.deleteMany({ contract: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
