import Contract from '../models/Contract.mjs';
import Customer from '../models/Customer.mjs';
import Task from '../models/Task.mjs';

export const createCustomer = async (req, res) => {
  const { customerName, cnpj, address } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ cnpj });
    if (existingCustomer) {
      return res.status(400).json({ message: 'CNPJ already exists' });
    }

    const newCustomer = new Customer({ customerName, cnpj, address });
    await newCustomer.save();

    res.status(201).json({ message: 'Customer created successfully', id: newCustomer._id, customerName: newCustomer.customerName, cnpj: newCustomer.cnpj, address: newCustomer.address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    const transformedCustomers = customers.map(customer => ({
      id: customer._id,
      customerName: customer.customerName,
      cnpj: customer.cnpj,
      address: customer.address
    }));
    res.status(200).json(transformedCustomers);
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
    res.status(200).json({ id: customer._id, customerName: customer.customerName, cnpj: customer.cnpj, address: customer.address });
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
    res.status(200).json({ message: 'Customer updated successfully', id: customer._id, customerName: customer.customerName, cnpj: customer.cnpj, address: customer.address });
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

    // Find and delete related contracts
    const contracts = await Contract.find({ customer: id });
    for (const contract of contracts) {
      await Task.deleteMany({ contract: contract._id }); // Delete related tasks
      await contract.deleteOne(); // Delete the contract
    }

    await customer.deleteOne(); // Delete the customer
    res.status(200).json({ message: 'Customer and related contracts/tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

