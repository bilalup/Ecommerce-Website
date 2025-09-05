import Product from "../model/product.model.js";

export const addProduct = async (req, res) => {
    const { title, description, price, image, category, stock } = req.body;
    try {
        if (!title || !price) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if(!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const product = new Product({
            title,
            description,
            price,
            image : req.file.path,
            category,
            stock,
            user: req.userId,
        });
        await product.save();
        res.status(200).json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.userId }).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Products fetched successfully", products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// get one product
export const GetOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product fetched successfully", product });

    } catch (error) {
     res.status(500).json({ success: false, message: error.message})   
    }
}

// Edit Product
export const EditProduct = async (req, res) => {
    const { title, description, price, image, category, stock } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.image = image || product.image;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        await product.save();
        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete Product
export const DeleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}