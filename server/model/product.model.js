import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    name: {
        type: String,
        required: true,
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    comment: {
        type: String,
    },
},
{ timestamps: true }
);

const variantSchema = new mongoose.Schema(
{
    color: {
        type: String,
        required: true,
    },

    size: {
        type: String,
        required: true,
    },

    stock: {
        type: Number,
        default: 30,
        min: 0,
    },
},
{ _id: false }
);

const productSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    category: {
        type: String,
        default: "",
        trim: true,
    },

    brand: {
        type: String,
        default: "",
        trim: true,
    },

    images: {
        type: [String],
        required: true,
        validate: [(arr) => arr.length > 0, "At least one image is required"],
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    discountPrice: {
        type: Number,
        min: 0,
        validate: {
            validator: function (value) {
                return value == null || value < this.price;
            },
            message: "Discount price must be less than price",
        },
    },

    variants: [variantSchema],

    tags: [{
        type: String,
        trim: true
    }],

    featured: {
        type: Boolean,
        default: false,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    sold: {
        type: Number,
        default: 0,
    },

    rating: {
        type: Number,
        default: 0,
    },

    numReviews: {
        type: Number,
        default: 0,
    },

    reviews: [reviewSchema],
},
{
    timestamps: true,
}
);

const Product = mongoose.model("Product", productSchema);

export default Product;