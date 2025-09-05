import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import axios from 'axios';

const Account = () => {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const serverApi = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${serverApi}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchOrders();
    }
  }, [user, serverApi]);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h2 className="font-bold text-lg">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <nav>
                <Link to="/account" className="block py-3 px-4 bg-purple-100 text-purple-700 rounded-lg font-medium mb-2">
                  Dashboard
                </Link>
                <Link to="/account/orders" className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition mb-2">
                  My Orders
                </Link>
                <Link to="/account/addresses" className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition mb-2">
                  Addresses
                </Link>
                <Link to="/account/wishlist" className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition mb-2">
                  Wishlist
                </Link>
                <Link to="/account/settings" className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition">
                  Account Settings
                </Link>
              </nav>
              
              <button 
                onClick={logout}
                className="mt-8 w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Account Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    {orders.length}
                  </div>
                  <h3 className="font-medium">Total Orders</h3>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    0
                  </div>
                  <h3 className="font-medium">Wishlist Items</h3>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    0
                  </div>
                  <h3 className="font-medium">Pending Reviews</h3>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
              
              {loading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                  <Link 
                    to="/products" 
                    className="inline-block bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-3 px-4">Order #</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Total</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 3).map(order => (
                        <tr key={order._id} className="border-b border-gray-200">
                          <td className="py-3 px-4">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="py-3 px-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Link 
                              to={`/order/${order._id}`} 
                              className="text-purple-700 hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Default Shipping Address</h2>
              
              {user?.address ? (
                <div>
                  <p className="mb-2">{user.address.street}</p>
                  <p className="mb-2">{user.address.city}, {user.address.state} {user.address.zip}</p>
                  <p className="mb-2">{user.address.country}</p>
                  <p className="mb-4">Phone: {user.address.phone || 'N/A'}</p>
                  
                  <Link 
                    to="/account/addresses" 
                    className="text-purple-700 hover:underline"
                  >
                    Edit Address
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="mb-4">You haven't added a shipping address yet</p>
                  <Link 
                    to="/account/addresses" 
                    className="inline-block bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Add Address
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;