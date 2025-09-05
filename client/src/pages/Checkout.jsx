import { useState } from 'react';
import { useCartStore } from '../store/store';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, total } = useCartStore();
  const { user } = useAuthStore();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process order submission
    alert('you can`t order because this is just a demo!');
    navigate('/');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={shippingInfo.zip}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={() => setPaymentMethod('credit-card')}
                      className="mr-2"
                    />
                    <label htmlFor="credit-card">Credit Card</label>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="mr-2"
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mr-2"
                    />
                    <label htmlFor="cod">Cash on Delivery</label>
                  </div>
                </div>
                
                {paymentMethod === 'credit-card' && (
                  <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Card Holder</label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {item.quantity} × ${item.price.toFixed(2)}
                        {item.size && ` • Size: ${item.size}`}
                      </div>
                    </div>
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3 font-bold text-lg">
                  <span>Total</span>
                  <span>${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;