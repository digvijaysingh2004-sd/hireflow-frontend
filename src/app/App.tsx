import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      <header className="max-w-5xl mx-auto w-full flex justify-between items-center py-4 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Briefcase className="w-6 h-6" />
          <span>HireFlow</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Phase 1 Active
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full mb-4">
                  <ShieldCheck className="w-4 h-4" /> Enterprise Recruitment Platform
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Welcome to HireFlow
                </h1>
                <p className="text-slate-600 mb-6 max-w-2xl">
                  Phase 1 Infrastructure configured cleanly with React, Vite, TypeScript, Tailwind CSS, TanStack Query, and Axios microservice adapters.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Identity Service API</h3>
                    <p className="text-xs text-slate-500">{import.meta.env.VITE_IDENTITY_API_BASE_URL || 'http://localhost:5001'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Hiring Service API</h3>
                    <p className="text-xs text-slate-500">{import.meta.env.VITE_HIRING_API_BASE_URL || 'http://localhost:5002'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Stack Status</h3>
                    <p className="text-xs text-emerald-600 font-medium">Ready for Phase 2 (Auth System)</p>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="max-w-5xl mx-auto w-full text-center py-6 text-xs text-slate-400 border-t border-slate-200 mt-8">
        HireFlow Recruitment Microservices • .NET 10 & React 18
      </footer>
    </div>
  );
};

export default App;
