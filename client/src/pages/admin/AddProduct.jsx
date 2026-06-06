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
        discountPrice: "",
        category: "",
        brand: "",
    });

    const [images, setImages] = useState([]);
    const [variants, setVariants] = useState([]);

    const categories = ["jeans", "t-shirts", "shoes"];

    const variantPresets = {
        "t-shirts": [
            { color: "black", size: "S", stock: 10 },
            { color: "black", size: "M", stock: 10 },
            { color: "black", size: "L", stock: 10 },
            { color: "black", size: "XL", stock: 10 },
        ],
        jeans: [
            { color: "blue", size: "28", stock: 10 },
            { color: "blue", size: "30", stock: 10 },
            { color: "blue", size: "32", stock: 10 },
            { color: "blue", size: "34", stock: 10 },
        ],
        shoes: [
            { color: "black", size: "39", stock: 10 },
            { color: "black", size: "40", stock: 10 },
            { color: "black", size: "41", stock: 10 },
            { color: "black", size: "42", stock: 10 },
        ],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });

        if (name === "category") {
            setVariants(variantPresets[value] || []);
        }
    };

    const handleImages = (e) => {
        setImages([...e.target.files]);
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const addVariant = () => {
        setVariants([...variants, { color: "", size: "", stock: 0 }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("discountPrice", formData.discountPrice);
            data.append("category", formData.category);
            data.append("brand", formData.brand);

            data.append("variants", JSON.stringify(variants));

            images.forEach((img) => {
                data.append("images", img);
            });

            const res = await axios.post(
                `${serverApi}/products/addProduct`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                navigate("/admin/products");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-2xl font-bold mb-6">Add Product</h1>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">

                <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2" />
                <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" />

                <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full border p-2" />

                <input type="number" name="discountPrice" placeholder="Discount Price" onChange={handleChange} className="w-full border p-2" />

                <input name="brand" placeholder="Brand" onChange={handleChange} className="w-full border p-2" />

                <select name="category" onChange={handleChange} className="w-full border p-2">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Images Upload */}
                <div>
                    <h3 className="font-bold mb-2">Images</h3>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImages}
                        className="w-full border p-2"
                    />

                    {/* Preview */}
                    <div className="flex gap-2 flex-wrap mt-3">
                        {images.map((img, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    className="w-20 h-20 object-cover rounded border"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setImages(images.filter((_, index) => index !== i))
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-2">Variants</h3>

                    {variants.map((v, i) => (
                        <div key={i} className="flex gap-2 mb-2">

                            <input value={v.color} onChange={(e) => handleVariantChange(i, "color", e.target.value)} className="border p-2" />

                            <input value={v.size} onChange={(e) => handleVariantChange(i, "size", e.target.value)} className="border p-2" />

                            <input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} className="border p-2 w-20" />

                            <button type="button" onClick={() => removeVariant(i)} className="text-red-500">
                                X
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addVariant} className="text-blue-600">
                        + Add Variant
                    </button>
                </div>

                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}

export default AddProduct;