import product from "../Models/product.js";
import BaseRepository from "../Repository/BaseRepository.js";

class ProductsService extends BaseRepository {
    constructor() {
        super(product);
    }
    async getProductsByCategory(category) {
        return await product.find({ category });
    }

    async getProductsById(id) {
        return await this.findById(id);
    }

    async getAllProducts() {
        return await product.find();
    }

    async createProduct(data) {
        return await this.create(data);
    }

    async updateProduct(id, data) {
        return await this.update(id, data);
    }

    async deleteProduct(id) {
        return await this.delete(id);
    }

    async getAllProductsStats() {
        try {
            const totalProducts = await product.countDocuments();
            const activeProducts = await product.countDocuments({ stock: { $gt: 0 } });
            const inactiveProducts = await product.countDocuments({ stock: { $lte: 0 } });

            return {
                totalProducts,
                activeProducts,
                inactiveProducts
            };
        } catch (err) {
            console.error("Error fetching product stats:", err);
            throw err;
        }
    }

}

export default new ProductsService();