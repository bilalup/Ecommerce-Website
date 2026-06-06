import Product from "../model/product.model.js";

export const addProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            brand,
            price,
            discountPrice,
            tags,
            featured,
            isActive,
        } = req.body;

        let variants = [];
        try {
            if (req.body.variants) {
                variants =
                    typeof req.body.variants === "string"
                        ? JSON.parse(req.body.variants)
                        : req.body.variants;
            }
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid variants format"
            });
        }

        if (!title || !price) {
            return res.status(400).json({
                success: false,
                message: "Title and price are required",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required",
            });
        }

        const images = req.files?.map(
            (file) => file.path || file.secure_url
        );

        const product = await Product.create({
            title,
            description,
            category,
            brand,
            price,
            discountPrice,
            images,
            variants, 
            tags: tags ?? [],
            featured: featured ?? false,
            isActive: isActive ?? true,
            user: req.userId,
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            user: req.userId,
            isActive: true,
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get one product
export const GetOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("user", "name email");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Edit Product
export const EditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const {
            title,
            description,
            category,
            brand,
            price,
            discountPrice,
            variants,
            tags,
            featured,
            isActive,
        } = req.body;

        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (category !== undefined) product.category = category;
        if (brand !== undefined) product.brand = brand;
        if (price !== undefined) product.price = price;
        if (discountPrice !== undefined) product.discountPrice = discountPrice;
        if (variants !== undefined) {
            try {
                product.variants =
                    typeof variants === "string"
                        ? JSON.parse(variants)
                        : variants;
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid variants format",
                });
            }
        }
        if (tags !== undefined) product.tags = tags;
        if (featured !== undefined) product.featured = featured;
        if (isActive !== undefined) product.isActive = isActive;

        let images = product.images || [];
        // keep existing images if frontend sends them
        if (req.body.existingImages) {
            try {
                images = JSON.parse(req.body.existingImages);
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid existingImages format",
                });
            }
        }

        // add new uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => file.path);
            images = [...images, ...newImages];
        }

        product.images = images;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Product
export const DeleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.isActive = false;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product archived successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};