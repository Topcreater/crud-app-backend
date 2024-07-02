// controllers/contractController.mjs
import Contract from '../models/Contract.mjs';
import Customer from '../models/Customer.mjs';

const formatContract = (contract) => ({
  id: contract._id, // Transform _id to id
  contractName: contract.contractName,
  customer: contract.customer,
  hourlyRate: contract.hourlyRate,
  contractedMonthlyHours: contract.contractedMonthlyHours,
  // Any other fields you need
});

export const createContract = async (req, res) => {
  const { contractName, customerId, hourlyRate, contractedMonthlyHours } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const newContract = new Contract({ contractName, customer: customerId, hourlyRate, contractedMonthlyHours });
    await newContract.save();
const contract = formatContract(newContract)
    res.status(201).json([{contract}]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate('customer', 'customerName');
    const formattedContracts = contracts.map(formatContract); // Map each contract to include id
    res.status(200).json(formattedContracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findById(id).populate('customer', 'customerName');
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(formatContract(contract)); // Return formatted contract
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContract = async (req, res) => {
  const { id } = req.params;
  const { contractName, customerId, hourlyRate, contractedMonthlyHours } = req.body;

  try {
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      contract.customer = customerId;
    }

    if (contractName !== undefined) contract.contractName = contractName;
    if (hourlyRate !== undefined) contract.hourlyRate = hourlyRate;
    if (contractedMonthlyHours !== undefined) contract.contractedMonthlyHours = contractedMonthlyHours;

    await contract.save();
    res.status(200).json({ message: 'Contract updated successfully', contract: formatContract(contract) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    await contract.deleteOne({ id: id });
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
