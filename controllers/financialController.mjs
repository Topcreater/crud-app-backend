// controllers/financialController.mjs
import FinancialEntry from '../models/FinancialEntry.mjs';

export const createEntry = async (req, res) => {
  const { value, description, date, type } = req.body;

  try {
    const newEntry = new FinancialEntry({ value, description, date, type });
    await newEntry.save();
    res.status(201).json({ message: 'Financial entry created successfully', entry: newEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const entries = await FinancialEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await FinancialEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Financial entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { value, description, date, type } = req.body;

  try {
    const entry = await FinancialEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Financial entry not found' });
    }

    if (value !== undefined) entry.value = value;
    if (description !== undefined) entry.description = description;
    if (date !== undefined) entry.date = date;
    if (type !== undefined) entry.type = type;

    await entry.save();
    res.status(200).json({ message: 'Financial entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await FinancialEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Financial entry not found' });
    }
    await entry.remove();
    res.status(200).json({ message: 'Financial entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
