import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Users, Package,
  DollarSign, Trash2, ChevronDown, Plus, X, Check,
  Clock, ArrowLeft, Edit, TrendingUp, AlertCircle
} from 'lucide-react';
import API from '../../services/api';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 flex items-center gap-5 hover:border-white/20 transition-all">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <h3 className="text-lg font-black uppercase tracking-widest">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">{label}</label>
    <input
      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-premium-violet/50 transition-all"
      {...props}
    />
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Product modal state
  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', image: '', description: '', category: '', stock: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, o, u, p] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/orders'),
        API.get('/admin/users'),
        API.get('/products'),
      ]);
      setStats(s.data);
      setOrders(o.data);
      setUsers(u.data);
      setProducts(p.data);
    } catch (err) {
      showToast('Failed to load data', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Order actions ────────────────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    await API.put(`/admin/orders/${id}/status`, { status });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    showToast('Order status updated');
  };

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return;
    await API.delete(`/admin/orders/${id}`);
    setOrders(orders.filter(o => o._id !== id));
    showToast('Order deleted');
  };

  // ── User actions ─────────────────────────────────────────────────────────
  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
    showToast('User deleted');
  };

  // ── Product actions ──────────────────────────────────────────────────────
  const openProductModal = (product = null) => {
    setEditingProduct(product);
    setProductForm(product
      ? { name: product.name, price: product.price, image: product.image, description: product.description, category: product.category, stock: product.stock }
      : { name: '', price: '', image: '', description: '', category: '', stock: '' }
    );
    setProductModal(true);
  };

  const saveProduct = async () => {
    try {
      const payload = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
      if (editingProduct) {
        const res = await API.put(`/admin/products/${editingProduct._id}`, payload);
        setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
        showToast('Product updated');
      } else {
        const res = await API.post('/admin/products', payload);
        setProducts([res.data, ...products]);
        showToast('Product created');
      }
      setProductModal(false);
    } catch (err) {
      showToast('Failed to save product', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await API.delete(`/admin/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
    showToast('Product deleted');
  };

  // ── Sidebar nav items ────────────────────────────────────────────────────
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.filter(o => o.status === 'pending').length },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-premium-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-zinc-950 border-r border-white/5 flex flex-col fixed top-0 left-0 h-full z-40">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="text-xl font-black tracking-[0.2em] uppercase text-white">
            VILUXE<span className="text-premium-violet">.</span>
          </Link>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all ${
                tab === id
                  ? 'bg-premium-violet text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm font-bold">{label}</span>
              </div>
              {count > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${tab === id ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors px-4 py-3"
          >
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl transition-all ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            {toast.msg}
          </div>
        )}

        {/* ── OVERVIEW ───────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            <div className="mb-10">
              <h1 className="text-4xl font-black italic tracking-tighter">Dashboard <span className="text-premium-violet">Overview</span></h1>
              <p className="text-zinc-500 mt-1">Welcome back, Admin. Here's what's happening.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} color="bg-premium-violet/20 text-premium-violet" sub="All time" />
              <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} color="bg-amber-500/20 text-amber-400" sub={`${orders.filter(o=>o.status==='pending').length} pending`} />
              <StatCard icon={Package} label="Products" value={stats?.totalProducts || 0} color="bg-cyan-500/20 text-cyan-400" sub="In catalog" />
              <StatCard icon={Users} label="Users" value={stats?.totalUsers || 0} color="bg-emerald-500/20 text-emerald-400" sub="Registered" />
            </div>

            {/* Recent Orders */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-black uppercase tracking-widest text-sm">Recent Orders</h2>
                <button onClick={() => setTab('orders')} className="text-xs text-premium-violet font-bold hover:underline">View All</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Order ID', 'Customer', 'Items', 'Total', 'Status'].map(h => (
                      <th key={h} className="text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-zinc-400">...{order._id.slice(-8)}</td>
                      <td className="px-6 py-4 font-bold">{order.customerName}</td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">{order.items.length} item(s)</td>
                      <td className="px-6 py-4 font-bold text-premium-violet">${order.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORDERS ─────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div>
            <div className="mb-10">
              <h1 className="text-4xl font-black italic tracking-tighter">All <span className="text-premium-violet">Orders</span></h1>
              <p className="text-zinc-500 mt-1">{orders.length} total orders</p>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest px-5 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-zinc-500">...{order._id.slice(-6)}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-sm">{order.customerName}</p>
                        <p className="text-zinc-500 text-xs">{order.userId?.email || '—'}</p>
                      </td>
                      <td className="px-5 py-4 text-zinc-400 text-sm">{order.items.length}</td>
                      <td className="px-5 py-4 font-bold text-premium-violet">${order.totalPrice.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-premium-violet/50 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => deleteOrder(order._id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-20 text-center text-zinc-600 text-sm">No orders yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ───────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black italic tracking-tighter">Manage <span className="text-premium-violet">Products</span></h1>
                <p className="text-zinc-500 mt-1">{products.length} products in catalog</p>
              </div>
              <button
                onClick={() => openProductModal()}
                className="flex items-center gap-2 bg-premium-violet text-white font-black px-6 py-3 rounded-2xl hover:bg-violet-600 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map(product => (
                <div key={product._id} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-all group">
                  <div className="w-full h-40 bg-black/50 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      : <Package size={40} className="text-zinc-700" />
                    }
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-black text-sm">{product.name}</h3>
                      <p className="text-zinc-500 text-xs capitalize">{product.category}</p>
                    </div>
                    <p className="text-premium-violet font-black shrink-0">${product.price?.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-zinc-600 mb-4">Stock: {product.stock}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openProductModal(product)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-premium-violet/20 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition-all">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-red-500/20 rounded-xl text-xs font-bold text-zinc-300 hover:text-red-400 transition-all">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS ──────────────────────────────────────────────────────── */}
        {tab === 'users' && (
          <div>
            <div className="mb-10">
              <h1 className="text-4xl font-black italic tracking-tighter">All <span className="text-premium-violet">Users</span></h1>
              <p className="text-zinc-500 mt-1">{users.length} registered users</p>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-bold">{user.name}</td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        {user.isAdmin
                          ? <span className="text-[10px] font-black bg-premium-violet/20 text-premium-violet px-3 py-1 rounded-full border border-premium-violet/30">Admin</span>
                          : <span className="text-[10px] font-black bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full border border-white/5">User</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {!user.isAdmin && (
                          <button onClick={() => deleteUser(user._id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Product Modal ─────────────────────────────────────────────────── */}
      {productModal && (
        <Modal title={editingProduct ? 'Edit Product' : 'Add Product'} onClose={() => setProductModal(false)}>
          <div className="space-y-4">
            <Field label="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Premium Headphones" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price ($)" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="299" />
              <Field label="Stock" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="50" />
            </div>
            <Field label="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} placeholder="e.g. electronics" />
            <Field label="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://..." />
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Description</label>
              <textarea
                value={productForm.description}
                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-premium-violet/50 transition-all resize-none"
                placeholder="Product description..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setProductModal(false)} className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-bold text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                Cancel
              </button>
              <button onClick={saveProduct} className="flex-1 py-3 rounded-2xl bg-premium-violet text-white text-sm font-black hover:bg-violet-600 hover:scale-[1.02] active:scale-[0.98] transition-all">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
