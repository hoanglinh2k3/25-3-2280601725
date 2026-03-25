const ProductSchema = require("../schemas/product.schema");

const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    const product = await ProductSchema.createProduct({
      name,
      price,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Create product successfully and inventory created automatically",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductSchema.getAllProducts();

    return res.status(200).json({
      success: true,
      message: "Get all products successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await ProductSchema.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get product by id successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
};