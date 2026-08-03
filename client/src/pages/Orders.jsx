import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../api/orders';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <p className="text-red-600 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No orders yet</h1>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">Start shopping to see your orders here.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">My Orders</h1>
      <div className="space-y-3 sm:space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3 gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  Order #{order._id.slice(-8)}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-blue-600 font-bold text-sm sm:text-base flex-shrink-0">
                ${order.total.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-gray-600 text-xs sm:text-sm">
                  <span className="truncate mr-2">{item.name} × {item.qty}</span>
                  <span className="flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;