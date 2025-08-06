
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { CircleUser, LogOut } from 'lucide-react';

export function RightUseInfo() {
  const { user, logout } = useAuth();

  return (
    <div className="text-right flex justify-start items-center">
      <span className="text-sm text-muted-foreground mx-1">Bem-vindo,</span>
     
      <div className="text-xs text-foreground mx-2 flex justify-start items-center"> 
        <CircleUser className="text-muted-foreground" /> 
        <span className='px-1'>{user?.name}</span> 
      </div>
      <span className="text-xs text-muted-foreground capitalize mx-1">
        {user?.role} {user?.subrole && `- ${user.subrole}`}
      </span>
      <button
        onClick={logout}
        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        title="Sair"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
