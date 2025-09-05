import { Link } from 'react-router-dom';
import { useCartStore } from '../store/store';
import { HiTrash, HiMinus, HiPlus } from 'react-icons/hi';

const Cart = () => {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCartStore();
  
  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link 
            to="/products" 
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 font-semibold">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-3">Quantity</div>
                <div className="col-span-2">Total</div>
              </div>
              
              {items.map(item => (
                <div 
                  key={item._id} 
                  className="grid grid-cols-1 md:grid-cols-12 items-center p-4 border-b"
                >
                  <div className="col-span-5 flex items-center mb-4 md:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm capitalize">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 font-semibold mb-4 md:mb-0">${item.price}</div>
                  
                  <div className="col-span-3 flex items-center mb-4 md:mb-0">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="border border-gray-300 rounded-l px-3 py-1"
                    >
                      <HiMinus />
                    </button>
                    <span className="border-t border-b border-gray-300 px-4 py-1">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="border border-gray-300 rounded-r px-3 py-1"
                    >
                      <HiPlus />
                    </button>
                  </div>
                  
                  <div className="col-span-2 flex justify-between items-center">
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <HiTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="p-4 flex justify-end">
                <button 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <HiTrash className="mr-1" /> Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-4">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="block w-full bg-purple-700 hover:bg-purple-600 text-white text-center py-3 rounded-lg font-semibold transition mb-4"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              to="/products" 
              className="block w-full border border-gray-300 text-center py-3 rounded-lg font-semibold transition hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;