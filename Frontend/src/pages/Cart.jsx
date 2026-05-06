import React from 'react';
import API from '../services/api';
import { Trash2, CreditCard, ChevronLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, removeFromCart, clearCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty");
    const orderData = {
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalPrice: total,
    };
    try {
      await API.post("/orders", orderData);
      alert("Order placed successfully! 🎉");
      clearCart();
    } catch (err) {
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link to="/store" className="text-gray-500 hover:text-[#e63946] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1a1a]">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {cart.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
            <Link
              to="/store"
              className="inline-block bg-[#1a1a1a] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#e63946] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition-colors">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain p-1" />
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1a1a1a] text-sm leading-snug truncate">{item.name}</h3>
                    {item.category && (
                      <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{item.category}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                  {/* Price + Remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-bold text-[#1a1a1a]">${(item.price * (item.quantity || 1)).toLocaleString()}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-[#e63946] transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-[#1a1a1a] text-lg mb-5">Order Summary</h3>

                <div className="space-y-3 text-sm text-gray-600 mb-5">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="font-semibold text-[#1a1a1a]">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-semibold text-[#1a1a1a]">${(total * 0.05).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-5">
                  <div className="flex justify-between font-bold text-[#1a1a1a] text-base">
                    <span>Total</span>
                    <span>${(total + total * 0.05).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#e63946] text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors text-sm"
                >
                  <CreditCard size={17} />
                  Proceed to Checkout
                </button>

                <Link
                  to="/store"
                  className="block text-center text-sm text-gray-500 hover:text-[#1a1a1a] font-medium mt-4 transition-colors"
                >
                  ← Continue Shopping
                </Link>

                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  🔒 Secure encrypted checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;