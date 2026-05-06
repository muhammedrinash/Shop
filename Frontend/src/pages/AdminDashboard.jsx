import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Users, Package,
  DollarSign, Trash2, Plus, X, Check,
  ArrowLeft, Edit, AlertCircle
} from 'lucide-react';
import API from '../services/api';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-2xl font-extrabold text-[#1a1a1a]">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-extrabold text-[#1a1a1a]">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={18} className="text-gray-500" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">{label}</label>
    <input
      className="w-full border border-gray-200 rounded-lg py-2.5 px-3.5 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-all bg-white"
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
      setStats(s.data); setOrders(o.data); setUsers(u.data); setProducts(p.data);
    } catch (err) { showToast('Failed to load data', 'error'); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

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

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
    showToast('User deleted');
  };

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
    } catch (err) { showToast('Failed to save product', 'error'); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await API.delete(`/admin/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
    showToast('Product deleted');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.filter(o => o.status === 'pending').length },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full z-40">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-lg font-extrabold tracking-tight text-[#1a1a1a]">VILUXE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] mb-2.5 ml-0.5"></span>
          </div>
          <p className="text-xs text-gray-400 font-semibold">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                tab === id
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-gray-600 hover:text-[#1a1a1a] hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} />
                <span className="text-sm font-semibold">{label}</span>
              </div>
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a1a1a] transition-colors px-3 py-2.5"
          >
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="ml-56 flex-1 p-6 md:p-8">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
            {toast.msg}
          </div>
        )}

        {/* ── OVERVIEW ───────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-[#1a1a1a]">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} color="bg-blue-50 text-blue-600" sub="All time" />
              <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} color="bg-amber-50 text-amber-600" sub={`${orders.filter(o=>o.status==='pending').length} pending`} />
              <StatCard icon={Package} label="Products" value={stats?.totalProducts || 0} color="bg-purple-50 text-purple-600" sub="In catalog" />
              <StatCard icon={Users} label="Users" value={stats?.totalUsers || 0} color="bg-green-50 text-green-600" sub="Registered" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-[#1a1a1a] text-sm">Recent Orders</h2>
                <button onClick={() => setTab('orders')} className="text-xs text-[#e63946] font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5 font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-3.5 font-semibold text-sm text-[#1a1a1a]">{order.customerName}</td>
                        <td className="px-6 py-3.5 text-gray-500 text-sm">{order.items.length}</td>
                        <td className="px-6 py-3.5 font-bold text-sm text-[#e63946]">${order.totalPrice.toLocaleString()}</td>
                        <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No orders yet.</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ─────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-[#1a1a1a]">All Orders</h1>
              <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-sm text-[#1a1a1a]">{order.customerName}</p>
                          <p className="text-gray-400 text-xs">{order.userId?.email || '—'}</p>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-sm">{order.items.length}</td>
                        <td className="px-5 py-3.5 font-bold text-sm text-[#e63946]">${order.totalPrice.toLocaleString()}</td>
                        <td className="px-5 py-3.5">
                          <select
                            value={order.status}
                            onChange={e => updateStatus(order._id, e.target.value)}
                            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1a1a1a] focus:outline-none focus:border-gray-400 bg-white cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => deleteOrder(order._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No orders yet.</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ───────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1a1a1a]">Manage Products</h1>
                <p className="text-gray-500 text-sm mt-1">{products.length} products in catalog</p>
              </div>
              <button
                onClick={() => openProductModal()}
                className="flex items-center gap-2 bg-[#1a1a1a] text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-[#e63946] transition-colors text-sm"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-full h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain p-3" />
                      : <Package size={36} className="text-gray-300" />
                    }
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-sm text-[#1a1a1a] line-clamp-1">{product.name}</h3>
                        <p className="text-gray-400 text-xs capitalize">{product.category}</p>
                      </div>
                      <p className="font-extrabold text-sm text-[#e63946] shrink-0">${product.price?.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Stock: {product.stock}</p>
                    <div className="flex gap-2">
                      <button onClick={() => openProductModal(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-all">
                        <Edit size={13} /> Edit
                      </button>
                      <button onClick={() => deleteProduct(product._id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold text-red-600 transition-all">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS ──────────────────────────────────────────────────────── */}
        {tab === 'users' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-[#1a1a1a]">All Users</h1>
              <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5 font-semibold text-sm text-[#1a1a1a]">{user.name}</td>
                        <td className="px-6 py-3.5 text-gray-500 text-sm">{user.email}</td>
                        <td className="px-6 py-3.5">
                          {user.isAdmin
                            ? <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">Admin</span>
                            : <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">User</span>
                          }
                        </td>
                        <td className="px-6 py-3.5 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-3.5">
                          {!user.isAdmin && (
                            <button onClick={() => deleteUser(user._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Product Modal ─────────────────────────────────────────────────── */}
      {productModal && (
        <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setProductModal(false)}>
          <div className="space-y-4">
            <Field label="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Premium Headphones" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price ($)" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="299" />
              <Field label="Stock" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="50" />
            </div>
            <Field label="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} placeholder="e.g. electronics" />
            <Field label="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://..." />
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea
                value={productForm.description}
                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg py-2.5 px-3.5 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-all resize-none"
                placeholder="Product description..."
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setProductModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={saveProduct} className="flex-1 py-2.5 rounded-lg bg-[#1a1a1a] text-white text-sm font-semibold hover:bg-[#e63946] transition-all">
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
