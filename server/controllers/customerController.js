
const { Op } = require("sequelize");
const Customer = require("../models/Customer");

// CREATE — add a new customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    // Handle duplicate email or validation errors nicely
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "That email already exists." });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ ALL — list customers with search + pagination
exports.getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    // Build a search filter across name, email, and company
    const where = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { company: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Customer.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]], // newest first
    });

    res.json({
      customers: rows,
      totalCustomers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ ONE — get a single customer by id
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE — edit an existing customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await customer.update(req.body);
    res.json(customer);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "That email already exists." });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE — remove a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await customer.destroy();
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};