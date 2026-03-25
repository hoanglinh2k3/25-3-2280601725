const InventorySchema = require("../schemas/inventory.schema");

const getAllInventories = async (req, res) => {
  try {
    const inventories = await InventorySchema.getAllInventories();

    return res.status(200).json({
      success: true,
      message: "Get all inventories successfully",
      data: inventories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInventoryById = async (req, res) => {
  try {
    const inventory = await InventorySchema.getInventoryById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get inventory by id successfully",
      data: inventory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "product and quantity > 0 are required",
      });
    }

    const inventory = await InventorySchema.addStock(product, quantity);

    return res.status(200).json({
      success: true,
      message: "Add stock successfully",
      data: inventory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "product and quantity > 0 are required",
      });
    }

    const inventory = await InventorySchema.removeStock(product, quantity);

    return res.status(200).json({
      success: true,
      message: "Remove stock successfully",
      data: inventory,
    });
  } catch (error) {
    const statusCode =
      error.message === "Inventory not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "product and quantity > 0 are required",
      });
    }

    const inventory = await InventorySchema.reservation(product, quantity);

    return res.status(200).json({
      success: true,
      message: "Reservation successfully",
      data: inventory,
    });
  } catch (error) {
    const statusCode =
      error.message === "Inventory not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "product and quantity > 0 are required",
      });
    }

    const inventory = await InventorySchema.sold(product, quantity);

    return res.status(200).json({
      success: true,
      message: "Sold successfully",
      data: inventory,
    });
  } catch (error) {
    const statusCode =
      error.message === "Inventory not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllInventories,
  getInventoryById,
  addStock,
  removeStock,
  reservation,
  sold,
};