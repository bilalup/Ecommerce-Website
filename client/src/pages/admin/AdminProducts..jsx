import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, productId: null });
    const serverApi = import.meta.env.VITE_SERVER_API;

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${serverApi}/products/getAllProducts`);
            setProducts(res.data.products);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`${serverApi}/products/deleteProduct/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
            setDeleteModal({ open: false, productId: null });
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                <Link
                    to="/admin/products/add"
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                    <FiPlus /> Add New Product
                </Link>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${product.price}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">{product.category || 'Uncategorized'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                            >
                                                <FiEdit2 /> Edit
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal({ open: true, productId: product._id })}
                                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal({ open: false, productId: null })}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.productId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;