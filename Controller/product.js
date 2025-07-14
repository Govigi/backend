const Product = require('../Models/product');
const { uploadImage } = require('../Controller/utils/upload_product');
const cloudinary = require('cloudinary').v2;

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    const formatted = products.map(product => ({
      ...product.toObject(),
      image: product.image || null
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err });
  }
};

const createProduct = async (req, res) => {
  let image = null;
  try {
    const { name, category, pricePerKg, stock } = req.body;
    if (req.file) {
      image = await uploadImage(req.file);
    }

    const product = new Product({
      name,
      category,
      pricePerKg,
      stock,
      image
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const updates = {
      name: req.body?.name,
      category: req.body?.category,
      pricePerKg: req.body?.pricePerKg,
      stock: req.body?.stock,
    };

    if(req.file){
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      updates.image = await uploadImage(req.file);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product', error: err });
  }
};

const deleteProduct = async (req , res) => {
  try{
    const product = await Product.findById(req.params.id);

    await cloudinary.uploader.destroy(product.image.public_id);
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({message: 'Deleted Successfully'});
  } catch (err) {
    res.status(400).json({message: err.message , error: err});
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
