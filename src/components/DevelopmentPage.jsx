import React from 'react';
import { CheckCircle, Circle, Server, Database, Brain, Layout } from 'lucide-react';

const TaskGroup = ({ title, icon: Icon, tasks }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
    <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
      <Icon className="text-indigo-600" size={24} />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div key={index} className="flex items-start gap-3">
          {task.completed ? (
            <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={20} />
          ) : (
            <Circle className="text-gray-300 mt-0.5 shrink-0" size={20} />
          )}
          <div>
            <p className={`text-sm font-medium ${task.completed ? 'text-gray-700' : 'text-gray-500'}`}>
              {task.name}
            </p>
            {task.details && <p className="text-xs text-gray-400 mt-1">{task.details}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DevelopmentPage = () => {
  const projectTasks = [
    {
      title: "Database Architecture",
      icon: Database,
      tasks: [
        { name: "Normalized Schema", details: "Tables: products, sales_history, suppliers", completed: true },
        { name: "Database Setup", details: "SQLite implementation with seeding script", completed: true },
        { name: "Data Access Layer", details: "Repository pattern with Promise-based queries", completed: true }
      ]
    },
    {
      title: "Backend API (Node.js/Express)",
      icon: Server,
      tasks: [
        { name: "API Structure", details: "Controller-Service-Repository pattern", completed: true },
        { name: "Analytics Route", details: "GET /api/analytics with 'Days Remaining' logic", completed: true },
        { name: "SEO Generation Route", details: "POST /api/products/:id/seo", completed: true },
        { name: "Environment Config", details: ".env and .env.example setup", completed: true }
      ]
    },
    {
      title: "AI Integration (Groq)",
      icon: Brain,
      tasks: [
        { name: "AI Service", details: "Reusable service for Groq API connections", completed: true },
        { name: "Stock Strategy", details: "Predicts reorder points and urgency", completed: true },
        { name: "Content Generation", details: "Generates SEO product descriptions", completed: true }
      ]
    },
    {
      title: "Frontend Dashboard (React)",
      icon: Layout,
      tasks: [
        { name: "Component Architecture", details: "Vite + React setup", completed: true },
        { name: "UI Styling", details: "Tailwind CSS implementation", completed: true },
        { name: "Data Visualization", details: "Critical stock highlighting & stats", completed: true },
        { name: "AI Integration UI", details: "Display insights and trigger SEO generation", completed: true }
      ]
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Development Progress</h1>
        <p className="text-gray-500">Tracking implementation of Smart Inventory AI SaaS</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectTasks.map((group, index) => (
          <TaskGroup key={index} {...group} />
        ))}
      </div>
    </div>
  );
};

export default DevelopmentPage;