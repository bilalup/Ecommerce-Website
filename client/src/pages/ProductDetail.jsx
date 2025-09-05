import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/store';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCartStore();
  
  const serverApi = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverApi}/products/getOneProduct/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load product');
      }

      setProduct(response.data.product);
      
      // Only fetch related products if category exists
      if (response.data.product.category) {
        const relatedResponse = await axios.get(
          `${serverApi}/products?category=${response.data.product.category}&limit=4`
        );
        setRelatedProducts(relatedResponse.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };
  
  fetchProduct();
}, [id, serverApi]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }
    
    addToCart({
      ...product,
      size: selectedSize,
      quantity
    });
  };

  if (loading) return <div className="pt-24 pb-16 text-center">Loading product...</div>;
  if (error) return <div className="pt-24 pb-16 text-center text-red-500">{error}</div>;
  if (!product) return <div className="pt-24 pb-16 text-center">Product not found</div>;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-purple-700">Home</Link> &gt; 
          <Link to={`/products/${product.category}`} className="hover:text-purple-700 capitalize"> {product.category}</Link> &gt; 
          <span> {product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg p-8 mb-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-96 object-contain"
              />
            </div>
            
            
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">(24 reviews)</span>
            </div>
            
            <div className="text-2xl font-bold text-purple-800 mb-6">${product.price}</div>
            
            <p className="text-gray-700 mb-8">{product.description}</p>
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`border px-4 py-2 rounded ${
                        selectedSize === size 
                          ? 'bg-purple-700 text-white border-purple-700' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center">
                <button 
                  className="border border-gray-300 rounded-l px-4 py-2"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <div className="border-t border-b border-gray-300 px-6 py-2">
                  {quantity}
                </div>
                <button 
                  className="border border-gray-300 rounded-r px-4 py-2"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Stock Status */}
            <div className={`mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 bg-purple-700 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition ${
                  product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Add to Cart
              </button>
              
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Wishlist
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button className="py-4 px-1 font-medium text-gray-500 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-700">
                Description
              </button>
              <button className="py-4 px-1 font-medium text-gray-500 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-700">
                Specifications
              </button>
              <button className="py-4 px-1 font-medium text-gray-500 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-700">
                Reviews (24)
              </button>
            </nav>
          </div>
          
          <div className="py-8">
            <h3 className="text-xl font-bold mb-4">Product Description</h3>
            <p className="text-gray-700">
              {product.fullDescription || "No additional description available."}
            </p>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <div key={p._id} className="bg-white rounded-lg shadow p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4" />
                <h3 className="font-semibold">{p.name}</h3>
                <div className="text-purple-700 font-bold">${p.price}</div>
                <Link 
                  to={`/product/${p._id}`}
                  className="mt-2 inline-block text-purple-700 hover:text-purple-900 font-medium"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;