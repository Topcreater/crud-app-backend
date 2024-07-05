import Contract from '../models/Contract.mjs';
import Customer from '../models/Customer.mjs';
import Task from '../models/Task.mjs';

const formatContract = (contract) => ({
  id: contract._id, // Transform _id to id
  contractName: {
    _id: contract.contractName._id,
    description: contract.contractName.description,
    technician: contract.contractName.technician,
    startDate: contract.contractName.startDate,
    endDate: contract.contractName.endDate,
    calculatedTime: contract.contractName.calculatedTime,
    contract: contract.contractName.contract,
    __v: contract.contractName.__v
  },
  customer: {
    _id: contract.customer._id,
    customerName: contract.customer.customerName,
    cnpj: contract.customer.cnpj,
    address: contract.customer.address,
    __v: contract.customer.__v
  },
  hourlyRate: contract.hourlyRate,
  contractedMonthlyHours: contract.contractedMonthlyHours,
  createdAt: contract.createdAt // Include createdAt field
});

export const createContract = async (req, res) => {
  const { contractName, customerId, hourlyRate, contractedMonthlyHours } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const task = await Task.findById(contractName);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const newContract = new Contract({
      contractName: task,
      customer: customer,
      hourlyRate,
      contractedMonthlyHours
    });
    await newContract.save();

    // Populate the fields after saving the document
    const populatedContract = await Contract.findById(newContract._id)
      .populate('contractName')
      .populate('customer')
      .exec();

    const contract = formatContract(newContract);
    res.status(201).json([{ contract }]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getContracts = async (req, res) => {
  const { startDate, endDate } = req.query; // Get start and end dates from query parameters
  const filter = {};

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  try {
    const contracts = await Contract.find(filter)
      .populate('customer')
      .populate('contractName'); // Populate full contractName

    const formattedContracts = contracts.map(formatContract); // Map each contract to include id
    res.status(200).json(formattedContracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findById(id)
      .populate('customer')
      .populate('contractName'); // Populate full contractName

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

    if (contractName) {
      const task = await Task.findById(contractName);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      contract.contractName = contractName;
    }

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
    await contract.deleteOne();
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
