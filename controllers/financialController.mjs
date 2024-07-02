// controllers/financialController.mjs
import FinancialEntry from '../models/FinancialEntry.mjs';

const transformEntry = (entry) => ({
  id: entry._id,
  value: entry.value,
  description: entry.description,
  date: entry.date,
  type: entry.type,
});

export const createEntry = async (req, res) => {
  const { value, description, date, type } = req.body;

  try {
    const newEntry = new FinancialEntry({ value, description, date, type });
    await newEntry.save();
    res.status(201).json({ message: 'Financial entry created successfully', entry: transformEntry(newEntry) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const entries = await FinancialEntry.find();
    const transformedEntries = entries.map(transformEntry);
    res.status(200).json(transformedEntries);
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
    res.status(200).json(transformEntry(entry));
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
    res.status(200).json({ message: 'Financial entry updated successfully', entry: transformEntry(entry) });
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
    await entry.deleteOne({ id: id });
    res.status(200).json({ message: 'Financial entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
