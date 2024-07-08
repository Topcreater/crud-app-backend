import Contract from '../models/Contract.mjs';
import Task from '../models/Task.mjs';



export const createTask = async (req, res) => {
  const { description, technician, startDate, endDate, contract } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const calculatedTime = Math.abs(end - start) / 36e5; // Difference in hours

    const contractData = await Contract.findById(contract).populate('customer');
    if (!contractData) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const newTask = new Task({
      description,
      technician,
      startDate,
      endDate,
      contract: contractData._id,
      calculatedTime,
    });
    await newTask.save();

    // Populate the contract field with all contract data before sending the response
    const populatedTask = await newTask.populate({
      path: 'contract',
      populate: { path: 'customer' }
    });

    res.status(201).json({ message: 'Task created successfully', task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate({
      path: 'contract',
      populate: { path: 'customer' }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id).populate({
      path: 'contract',
      populate: { path: 'customer' }
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { description, technician, startDate, endDate, contract } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (description !== undefined) task.description = description;
    if (technician !== undefined) task.technician = technician;
    if (startDate !== undefined) task.startDate = startDate;
    if (endDate !== undefined) task.endDate = endDate;
    if (contract) {
      const contractData = await Contract.findById(contract).populate('customer');
      if (!contractData) {
        return res.status(404).json({ message: 'Contract not found' });
      } else {
        task.contract = contractData._id;
      }
    }

    await task.save();

    const populatedTask = await task.populate({
      path: 'contract',
      populate: { path: 'customer' }
    });

    res.status(200).json({ message: 'Task updated successfully', task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await Task.deleteOne({ _id: id }); // Use deleteOne to delete the task
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



