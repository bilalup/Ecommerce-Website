import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    stock: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    numReviews: {
        type: Number,
    },
});

const Product = mongoose.model('Product', productSchema);
export default Product;