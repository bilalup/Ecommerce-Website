import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft, FiPlus } from "react-icons/fi";

function EditProduct() {
    const serverApi = import.meta.env.VITE_SERVER_API;
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        brand: "",
    });

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${serverApi}/products/getOneProduct/${id}`
                );

                const p = res.data.product;

                setFormData({
                    title: p.title || "",
                    description: p.description || "",
                    price: p.price || "",
                    discountPrice: p.discountPrice || "",
                    category: p.category || "",
                    brand: p.brand || "",
                    stock: p.stock || "",
                });

                setExistingImages(p.images || []);
                setVariants(p.variants || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "price" ||
                name === "discountPrice" ||
                name === "stock"
                    ? value === ""
                        ? ""
                        : Number(value)
                    : value,
        }));

        if (name === "category") {
            setVariants(variantPresets[value] || []);
        }
    };

    const handleImages = (e) => {
        setImages([...e.target.files]);
    };

    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
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

            // keep existing images (important)
            data.append("existingImages", JSON.stringify(existingImages));

            // new uploaded images
            images.forEach((img) => {
                data.append("images", img);
            });

            await axios.put(
                `${serverApi}/products/editProduct/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            navigate("/admin/products");
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-4 border-purple-700 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate("/admin/products")}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                >
                    <FiArrowLeft /> Back
                </button>

                <h1 className="text-2xl font-bold">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Fields */}
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-2"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border p-2"
                />

                <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full border p-2"
                />

                <input
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    placeholder="Discount Price"
                    className="w-full border p-2"
                />

                <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand"
                    className="w-full border p-2"
                />

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border p-2"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* EXISTING IMAGES */}
                <div>
                    <h3 className="font-bold mb-2">Existing Images</h3>

                    <div className="flex gap-3 flex-wrap">
                        {existingImages.map((img, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={img}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEW IMAGES */}
                <input
                    type="file"
                    multiple
                    onChange={handleImages}
                    className="w-full border p-2"
                />

                {/* VARIANTS */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">Variants</h3>

                        <button
                            type="button"
                            onClick={addVariant}
                            className="text-blue-600 flex items-center gap-1"
                        >
                            <FiPlus /> Add
                        </button>
                    </div>

                    {variants.map((v, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input
                                placeholder="Color"
                                value={v.color}
                                onChange={(e) =>
                                    handleVariantChange(i, "color", e.target.value)
                                }
                                className="border p-2"
                            />

                            <input
                                placeholder="Size"
                                value={v.size}
                                onChange={(e) =>
                                    handleVariantChange(i, "size", e.target.value)
                                }
                                className="border p-2"
                            />

                            <input
                                type="number"
                                placeholder="Stock"
                                value={v.stock}
                                onChange={(e) =>
                                    handleVariantChange(i, "stock", e.target.value)
                                }
                                className="border p-2 w-24"
                            />

                            <button
                                type="button"
                                onClick={() => removeVariant(i)}
                                className="text-red-500"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="bg-purple-700 text-white px-6 py-2 flex items-center gap-2"
                >
                    <FiSave /> Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProduct;