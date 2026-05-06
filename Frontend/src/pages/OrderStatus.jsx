import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, X, MapPin, Phone, User, Receipt, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    API.get('/orders')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-7">
          <h1 className="text-2xl font-extrabold text-slate-900">My Orders</h1>
          <p className="text-slate-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-500 text-sm mb-6">You haven't placed any orders. Start shopping!</p>
            <Link to="/store"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    {/* Order ID + Date */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-wide">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Customer */}
                    <p className="font-semibold text-slate-900 text-sm mb-1">{order.customerName}</p>

                    {/* Items */}
                    <p className="text-slate-500 text-xs">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} &middot;{' '}
                      <span className="font-semibold text-slate-900">${order.totalPrice?.toLocaleString()}</span>
                    </p>

                    {/* Item tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <span key={i} className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-[11px] text-slate-400">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      order.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {order.status === 'pending' ? <Clock size={12} /> : <CheckCircle size={12} />}
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </div>
                    <button onClick={() => setSelectedOrder(order)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Order Details</h2>
                <p className="text-slate-400 text-xs font-mono mt-0.5">#{selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                selectedOrder.status === 'pending'
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                {selectedOrder.status === 'pending' ? <Clock size={20} /> : <CheckCircle size={20} />}
                <div>
                  <p className="font-bold text-sm capitalize">{selectedOrder.status}</p>
                  <p className="text-xs opacity-80">
                    {selectedOrder.status === 'pending'
                      ? 'Your order is being processed.'
                      : 'Your order has been completed!'}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                {[
                  { icon: <User size={16} />, label: 'Customer', value: selectedOrder.customerName },
                  selectedOrder.phone && { icon: <Phone size={16} />, label: 'Phone', value: selectedOrder.phone },
                  selectedOrder.address && { icon: <MapPin size={16} />, label: 'Delivery Address', value: selectedOrder.address },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                      <p className="font-semibold text-sm text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Receipt size={13} /> Items Ordered
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border border-slate-100 rounded-lg px-4 py-3 bg-slate-50">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-0.5">Order Total</p>
                  <p className="text-2xl font-extrabold text-blue-600">
                    ${selectedOrder.totalPrice?.toLocaleString()}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
