import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { AlertTriangle, Package, TrendingUp, BrainCircuit, Sparkles, Plus, X, ShoppingCart, FileText, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-inventory-saas.onrender.com';

const Dashboard = () => {
  const { getToken } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', price: '', current_stock: '', min_threshold: '', supplier_id: 1
  });

  const fetchInventory = async () => {
    // In a real app, use an env variable for the API URL
    const token = await getToken();
    fetch(`${API_URL}/api/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(response => {
        setInventory(response.data.products);
        setIsPro(response.data.isPro);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch data", err));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading AI Analytics...</div>;

  const handleGenerateSeo = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/products/${id}/seo`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        // Update local state immediately
        setInventory(prev => prev.map(item => 
          item.id === id ? { ...item, seo_description: data.data.seo_text } : item
        ));
      }
    } catch (error) {
      console.error("Error generating SEO:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({ name: '', sku: '', price: '', current_stock: '', min_threshold: '', supplier_id: 1 });
        fetchInventory(); // Refresh list
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleRecordSale = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/sales`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id, quantity: 1 })
      });
      if (res.ok) {
        fetchInventory();
      }
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };

  const criticalItems = inventory.filter(i => i.status === 'CRITICAL');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" /> 
            Smart Inventory AI
          </h1>
          <p className="text-gray-500">Real-time stock tracking & Groq predictions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
            <Package className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical Stock</p>
              <p className="text-2xl font-bold text-red-600">{criticalItems.length}</p>
            </div>
            <AlertTriangle className="text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">AI Insights Generated</p>
              <p className="text-2xl font-bold text-indigo-600">
                {inventory.filter(i => i.ai_insight).length}
              </p>
            </div>
            <TrendingUp className="text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Stock Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Stock / Threshold</th>
                <th className="p-4">Est. Days Left</th>
                <th className="p-4">AI Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    {item.name}
                    <div className="text-xs text-gray-400">{item.sku}</div>
                  </td>
                  <td className="p-4">
                    <span className={`${item.status === 'CRITICAL' ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                      {item.stock}
                    </span>
                    <span className="text-gray-400"> / {item.threshold}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.days_remaining < 7 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.days_remaining} Days
                    </span>
                  </td>
                  <td className="p-4">
                    {!isPro && item.status === 'CRITICAL' ? (
                      <div className="flex items-center gap-2 text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <Lock size={16} />
                        <span className="text-xs font-medium">Pro Feature</span>
                      </div>
                    ) : item.ai_insight ? (
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-700 mb-1">
                          AI: {item.ai_insight.recommendation}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Urgency:</span>
                          <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500" 
                              style={{ width: `${item.ai_insight.reorder_urgency * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {item.seo_description ? (
                          <div className="group relative">
                            <span className="cursor-help text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <FileText size={12} /> SEO Ready
                            </span>
                            {/* Tooltip for SEO Text */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {item.seo_description}
                            </div>
                          </div>
                        ) : !isPro ? (
                          <button className="p-1 text-gray-300 cursor-not-allowed" title="Upgrade to Pro to use AI">
                             <Lock size={16} />
                          </button>
                        ) : ( 
                          <button 
                            onClick={() => handleGenerateSeo(item.id)}
                            className="p-1 hover:bg-indigo-50 rounded text-indigo-600 transition-colors"
                            title="Generate SEO Description"
                          >
                            <Sparkles size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleRecordSale(item.id)}
                          className="p-1 hover:bg-green-50 rounded text-green-600"
                          title="Record Sale (1 Unit)"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" className="w-full p-2 border rounded-lg" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" className="w-full p-2 border rounded-lg" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input required type="number" className="w-full p-2 border rounded-lg" value={newProduct.current_stock} onChange={e => setNewProduct({...newProduct, current_stock: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
                  <input required type="number" className="w-full p-2 border rounded-lg" value={newProduct.min_threshold} onChange={e => setNewProduct({...newProduct, min_threshold: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;