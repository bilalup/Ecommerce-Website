import { Link } from 'react-router-dom';
import { useCartStore } from '../store/store';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="relative pb-[100%]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="absolute h-full w-full object-cover"
          />
          {product.isFeatured && (
            <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/product/${product._id}`}>
              <h3 className="font-bold text-lg hover:text-purple-700 transition">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-500 text-sm capitalize">{product.category}</p>
          </div>
          <span className="font-bold text-purple-800">${product.price}</span>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={() => addToCart(product)}
            className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition flex items-center"
          >
            Add to Cart
          </button>
          
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;