import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import DevelopmentPage from './components/DevelopmentPage';
import Login from './components/Login';
import { LayoutDashboard, ListTodo, LogOut } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  if (!token) return <Login setToken={setToken} />;

  const handleLogout = () => {
    setToken(null);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="font-bold text-xl text-indigo-600 flex items-center gap-2">
           Smart Inventory SaaS
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button 
            onClick={() => setView('dev')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${view === 'dev' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ListTodo size={18} />
            Dev Progress
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {view === 'dashboard' ? <Dashboard token={token} /> : <DevelopmentPage />}
      </main>
    </div>
  );
}

export default App;