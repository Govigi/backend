import Template from "../Models/template.js";
import product from "../Models/product.js";

export const createTemplate = async (req, res) => {
    try{
        const{name,items,userId} = req.body;

        const productIds = items.map(i => i.productId);
        const existingProducts = await product.find({ _id: { $in: productIds } });

        console.log("Existing products found:", existingProducts);

        if(existingProducts.length !== productIds.length){
            return res.status(400).json({ message: "One or more products do not exist" });
        }

        const enrichedItems = items.map((i) => {
            const prod = existingProducts.find(p => p._id.toString() === i.productId);
            if(prod){
                return {
                    productId: i.productId,
                    productName: prod?.name,
                    productImage: prod?.image.url,
                    category: prod?.category,
                    weeklyPlan: i.weeklyPlan || {}
                };
            }
        });

        if(templateExists){
            return res.status(400).json({ message: "Template with this name already exists" });
        }

        const newTemplate = new Template({
            userId,
            name,
            items: enrichedItems
        });
        await newTemplate.save();
        res.status(201).json({ message: "Template created successfully", Template: newTemplate });
    }
    catch(err){
        console.error("Error creating template:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};