import React from 'react';
import API from '../services/api';
import { Trash2, CreditCard, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, removeFromCart, clearCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your bag is empty");

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
      alert("Order Placed! Welcome to the Elite club. 🚀");
      clearCart();
    } catch (err) {
      alert("Checkout failed. Please try again.");
    }
  };


  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-3 bg-zinc-900 rounded-full hover:bg-premium-violet transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-4xl font-black italic tracking-tighter">YOUR <span className="text-premium-violet">BAG.</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-20 text-center">
              <p className="text-zinc-500 uppercase tracking-widest font-bold">Your bag is currently empty.</p>
              <Link to="/" className="text-premium-violet mt-4 inline-block font-bold border-b border-premium-violet">Go Shopping</Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex items-center gap-6 group hover:border-premium-violet/30 transition-all">
                <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                   <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{item.category || 'Premium Collection'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black mb-2">${item.price.toLocaleString()}</p>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 sticky top-32">
            <h3 className="text-xl font-bold mb-8 uppercase tracking-widest">Order Summary</h3>
            
            <div className="space-y-4 mb-8 text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold uppercase text-xs tracking-widest">Complimentary</span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between text-xl font-black text-white">
                <span>Total</span>
                <span className="text-premium-violet">${total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-premium-violet hover:text-white transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <CreditCard size={20} />
              CHECKOUT NOW
            </button>
            
            <p className="text-[10px] text-center text-zinc-600 mt-6 uppercase tracking-[0.2em]">Secure encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;