// controllers/taskController.mjs
import Task from '../models/Task.mjs';
import Contract from '../models/Contract.mjs';
import pdf from 'pdfkit';
import fs from 'fs';


export const createTask = async (req, res) => {
    const { description, technician, startDate, endDate, contractId } = req.body;
  
    try {
      const contract = await Contract.findById(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
  
      // Calculate the difference between start and end dates in hours
      const start = new Date(startDate);
      const end = new Date(endDate);
      const calculatedTime = Math.abs(end - start) / 36e5; // Difference in hours
  
      const newTask = new Task({ 
        description, 
        technician, 
        startDate, 
        endDate, 
        contract: contractId, 
        calculatedTime
      });
      await newTask.save();
  
      res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('contract', 'contractName');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id).populate('contract', 'contractName');
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
  const { description, technician, startDate, endDate, contractId } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (description !== undefined) task.description = description;
    if (technician !== undefined) task.technician = technician;
    if (startDate !== undefined) task.startDate = startDate;
    if (endDate !== undefined) task.endDate = endDate;
    if (contractId !== undefined) task.contract = contractId;

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
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

