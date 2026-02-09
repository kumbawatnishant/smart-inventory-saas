import React, { useState } from 'react';
import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";
import Dashboard from './components/Dashboard';
import DevelopmentPage from './components/DevelopmentPage';
import Login from './components/Login';
import { LayoutDashboard, ListTodo, LogOut } from 'lucide-react';

function App() {
  const { signOut } = useClerk();
  const [view, setView] = useState('dashboard');

  return (
    <>
      <SignedOut>
        <Login />
      </SignedOut>
      <SignedIn>
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
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {view === 'dashboard' ? <Dashboard /> : <DevelopmentPage />}
          </main>
        </div>
      </SignedIn>
    </>
  );
}

export default App;