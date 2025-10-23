import Product from '../Models/product.js';
import { uploadImage } from '../Controller/utils/upload_product.js';
import cloudinary from 'cloudinary';
const { v2: cloudinaryV2 } = cloudinary;
import productsService from '../Services/ProductsService.js';

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);

    let products, total, totalPages;

    if (!page || !perPage) {
      products = await Product.find({});
      total = products.length;
      totalPages = 1;
    } else {
      total = await Product.countDocuments({});
      products = await Product.find({})
        .skip((page - 1) * perPage)
        .limit(perPage);
      totalPages = Math.ceil(total / perPage);
    }

    const formatted = products.map(product => ({
      ...product.toObject(),
      image: product.image || null,
      price: product.pricePerKg,
    }));

    res.status(200).json({
      products: formatted,
      page: page || 1,
      perPage: perPage || total,
      total,
      totalPages
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err });
  }
};

const createProduct = async (req, res) => {
  let image = null;
  try {
    const { name, category, pricePerKg, stock, currentStock,minimumThreshold } = req.body;
    if (req.file) {
      image = await uploadImage(req.file);
    }

    const product = new Product({
      name,
      category,
      pricePerKg,
      stock,
      image,
      currentStock,
      minimumThreshold
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
      currentStock: req.body?.currentStock,
      minimumThreshold: req.body?.minimumThreshold
    };

    if(req.file){
      if (product.image?.public_id) {
        await cloudinaryV2.uploader.destroy(product.image.public_id);
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

const getProductsStats = async (req, res) => {
  try {
    const stats = await productsService.getAllProductsStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching product stats:", err);
    res.status(500).json({ message: 'Failed to fetch product stats', error: err });
  }
}

export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsStats
};
