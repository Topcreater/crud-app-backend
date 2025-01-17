// models/Task.mjs
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  technician: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  calculatedTime: { type: Number, required: true },
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }
});

taskSchema.pre('save', function(next) {
  this.calculatedTime = (this.endDate - this.startDate) / (1000 * 60 * 60); // Calculate time in hours
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
