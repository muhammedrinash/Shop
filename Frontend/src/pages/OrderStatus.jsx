import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, X, MapPin, Phone, User, Receipt } from 'lucide-react';
import API from '../services/api';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    API.get('/orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="pt-32 pb-20 text-center text-white min-h-screen">Loading Orders...</div>;
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1000px] mx-auto min-h-screen text-white relative">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter mb-4">Order Status</h1>
        <p className="text-zinc-400">Track all recent orders placed in the system.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 rounded-[2rem] border border-white/5">
          <Package className="mx-auto mb-4 text-zinc-600" size={48} />
          <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>
          <p className="text-zinc-400">There are currently no orders in the system.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-zinc-900/60 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-premium-violet/30 transition-colors">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-zinc-300">
                    ID: {order._id.substring(order._id.length - 8)}
                  </span>
                  <span className="text-zinc-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{order.customerName}</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  {order.items.length} item(s) • ${order.totalPrice.toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="text-xs bg-black/50 border border-white/5 px-2 py-1 rounded-md text-zinc-300">
                      {item.name} (x{item.quantity})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-4 md:gap-2">
                <div className="flex items-center gap-2">
                  {order.status === 'pending' ? (
                    <Clock size={20} className="text-amber-500" />
                  ) : (
                    <CheckCircle size={20} className="text-emerald-500" />
                  )}
                  <span className={`font-bold uppercase tracking-widest text-sm ${
                    order.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="text-xs font-bold border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-950/90 backdrop-blur border-b border-white/5 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-black italic tracking-tight">Order Details</h2>
                <p className="text-zinc-500 text-xs font-mono mt-1">ID: {selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                selectedOrder.status === 'pending' 
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              }`}>
                {selectedOrder.status === 'pending' ? <Clock size={24} /> : <CheckCircle size={24} />}
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">{selectedOrder.status}</h4>
                  <p className="text-xs opacity-80">
                    {selectedOrder.status === 'pending' 
                      ? 'Your order is currently being processed.' 
                      : 'Your order has been completed and shipped.'}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={14} /> Customer</h4>
                  <p className="font-medium text-lg">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Phone size={14} /> Contact</h4>
                  <p className="font-medium text-zinc-300">{selectedOrder.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={14} /> Delivery Address</h4>
                  <p className="font-medium text-zinc-300 leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5">
                    {selectedOrder.address}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Receipt size={14} /> Items Ordered</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-zinc-400 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-zinc-600">Payment Method: Secure Checkout</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-4xl font-black italic text-premium-violet">${selectedOrder.totalPrice.toLocaleString()}</p>
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
