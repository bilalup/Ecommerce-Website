import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const serverApi = import.meta.env.VITE_SERVER_API;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: ""
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("stock", formData.stock);
            formDataToSend.append("image", image);

            const response = await axios.post(`${serverApi}/products/addProduct`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                navigate("/admin/products");
            }
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-20 justify-center">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block mb-1">Product Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-1">Price *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-1">Category *</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block mb-1">Stock Quantity *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block mb-1">Product Image *</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;