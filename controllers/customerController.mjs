// controllers/customerController.mjs
import Customer from '../models/Customer.mjs';

export const createCustomer = async (req, res) => {
  const { customerName, cnpj, address } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ cnpj });
    if (existingCustomer) {
      return res.status(400).json({ message: 'CNPJ already exists' });
    }

    const newCustomer = new Customer({ customerName, cnpj, address });
    await newCustomer.save();

    res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { customerName, cnpj, address } = req.body;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customerName !== undefined) customer.customerName = customerName;
    if (cnpj !== undefined) customer.cnpj = cnpj;
    if (address !== undefined) customer.address = address;

    await customer.save();
    res.status(200).json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.remove();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
