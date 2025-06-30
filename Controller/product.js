const Product = require('../Models/product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, pricePerKg, stock, status } = req.body;
    const imageFilename = req.file?.filename || null;

    const product = new Product({
      name,
      category,
      pricePerKg,
      stock,
      image: imageFilename,
      status,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product', error: err });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
};
