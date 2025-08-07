import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { CircleUser, LogOut } from 'lucide-react';

export function RightUseInfo() {

  const { user, logout } = useAuth();

  return (
    <div className="text-right flex justify-start items-center">
      <span className="text-sm text-gray-500 mx-1">Bem-vindo,</span>
     
      <div className="text-xs text-gray-900 mx-2 flex justify-start items-center"> 
        <CircleUser />       
        <span className="text-xs text-gray-500 capitalize mx-1">
        {user?.role} {user?.subrole && `- ${user.subrole}`}
      </span>
      </div>
      <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
    </div>
  );
}