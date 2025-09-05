import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";

function EditProduct() {
    const serverApi = import.meta.env.VITE_SERVER_API;
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        sizes: [],
        colors: [],
        stock: 0
    });
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState("");

    // Available options
    const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
    const colorOptions = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product data
                const productRes = await axios.get(`${serverApi}/products/getProduct/${id}`);
                setFormData(productRes.data.product);
                setImagePreview(productRes.data.product.image);

                // Fetch categories
                const categoriesRes = await axios.get(`${serverApi}/categories`);
                setCategories(categoriesRes.data.categories);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setFormData({
                ...formData,
                image: file
            });
        }
    };

    const handleSizeChange = (size) => {
        setFormData({
            ...formData,
            sizes: formData.sizes.includes(size)
                ? formData.sizes.filter(s => s !== size)
                : [...formData.sizes, size]
        });
    };

    const handleColorChange = (color) => {
        setFormData({
            ...formData,
            colors: formData.colors.includes(color)
                ? formData.colors.filter(c => c !== color)
                : [...formData.colors, color]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // If image is a file, upload it first
            let imageUrl = formData.image;
            if (typeof formData.image !== "string") {
                const formDataImg = new FormData();
                formDataImg.append("image", formData.image);
                const uploadRes = await axios.post(`${serverApi}/upload`, formDataImg);
                imageUrl = uploadRes.data.url;
            }

            // Update product with the new data
            await axios.put(`${serverApi}/products/updateProduct/${id}`, {
                ...formData,
                image: imageUrl
            });

            navigate("/admin/products");
        } catch (err) {
            console.error("Error updating product:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.title) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button
                    onClick={() => navigate("/admin/products")}
                    className="flex items-center gap-2 text-purple-700 hover:text-purple-900"
                >
                    <FiArrowLeft /> Back to Products
                </button>
                <h1 className="text-3xl font-bold text-gray-800 mt-4">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                        {/* Product Image */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                            <div className="flex items-center gap-4">
                                <div className="w-32 h-32 rounded-md overflow-hidden bg-gray-100">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        id="image"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="image"
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
                                    >
                                        Change Image
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Description */}
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Sizes */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeChange(size)}
                                        className={`px-3 py-1 border rounded-md ${
                                            formData.sizes.includes(size)
                                                ? "bg-purple-700 text-white border-purple-700"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                            <div className="flex flex-wrap gap-3">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handleColorChange(color)}
                                        className={`w-8 h-8 rounded-full border-2 ${
                                            formData.colors.includes(color)
                                                ? "ring-2 ring-offset-2 ring-purple-500"
                                                : "border-gray-300"
                                        }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md flex items-center gap-2 transition-colors"
                        disabled={loading}
                    >
                        <FiSave /> {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;