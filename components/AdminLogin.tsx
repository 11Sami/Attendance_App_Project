import React, { useState } from 'react';
import { UserIcon, KeyIcon, ArrowRightIcon, ArrowUturnLeftIcon } from './icons/Icons';

interface AdminLoginProps {
  onSubmit: (success: boolean) => void;
  onBack: () => void;
  error: string | null;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSubmit, onBack, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for this example
    const isAdmin = username === 'admin' && password === 'Admin1234';
    onSubmit(isAdmin);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyan-300">Admin Login</h2>
        <p className="text-slate-400">Please enter your credentials.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition duration-200"
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition duration-200"
          />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                <span>Back</span>
            </button>
            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!username || !password}
            >
                <span>Login</span>
                <ArrowRightIcon className="h-5 w-5" />
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
