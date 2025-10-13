import mongoose from "mongoose";
import product from "../Models/product.js";

const weeklyPlanSchema = new mongoose.Schema({
    Mon:{
        quantity:{
            type: Number,
            default: 0
        },
        unit:{
            type: String,
            default: "Kg"
        }
    },
    Tue:{
        quantity:{
            type: Number,
            default: 0
        },
        unit:{
            type: String,
            default: "Kg"
        }
    },
    Wed:{
        quantity:{
            type: Number,
            default: 0
        },
        unit:{
            type: String,
            default: "Kg"
        }
    },
    Thu:{
        quantity:{
            type: Number,
            default: 0
        },
        unit:{
            type: String,
            default: "Kg"
        }
    },
    Fri:{
        quantity:{
            type: Number,
            default: 0
        },
        unit:{
            type: String,
            default: "Kg"
        }
    },
    Sat:{
        quantity:{
            type: Number,
            default: 0
        },
        unit:{
            type: String,
            default: "Kg"
        }
    },
    Sun:{
        quantity:{
            type: Number,
            default: 0
        },
        unit:{
            type: String,
            default: "Kg"
        }
    }
});

const productTemplateSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
        unique: true
    },
    productName:{
        type: String,
        required: true,
    },
    productImage:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    weeklyPlan:{
        type: weeklyPlanSchema,
        default: () => ({})
    }
});

const templateSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    items:[productTemplateSchema],
},{ timestamps: true });

export default mongoose.model("Template", templateSchema);