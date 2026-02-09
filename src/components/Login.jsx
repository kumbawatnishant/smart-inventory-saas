import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-inventory-saas.onrender.com';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Smart Inventory Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg p-2 bg-gray-50">
            <User className="text-gray-400 mr-2" size={20} />
            <input type="text" placeholder="Username" className="bg-transparent outline-none w-full" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="flex items-center border rounded-lg p-2 bg-gray-50">
            <Lock className="text-gray-400 mr-2" size={20} />
            <input type="password" placeholder="Password" className="bg-transparent outline-none w-full" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;