import React from 'react';
import { UserRole } from '../types';
import { UserIcon, UserGroupIcon } from './icons/Icons';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-6 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200 transform hover:scale-105"
  >
    <div className="flex items-center gap-4">
      <div className="bg-slate-800 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="font-bold text-lg text-white">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  </button>
);

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyan-300">Choose Your Role</h2>
        <p className="text-slate-400">How would you like to use the app today?</p>
      </div>
      <div className="space-y-4">
        <RoleCard
          icon={<UserIcon className="h-6 w-6 text-cyan-400" />}
          title="Login as User"
          description="Proceed to check-in for attendance."
          onClick={() => onSelectRole(UserRole.USER)}
        />
        <RoleCard
          icon={<UserGroupIcon className="h-6 w-6 text-cyan-400" />}
          title="Login as Admin"
          description="View all attendance records."
          onClick={() => onSelectRole(UserRole.ADMIN)}
        />
      </div>
    </div>
  );
};

export default RoleSelection;
