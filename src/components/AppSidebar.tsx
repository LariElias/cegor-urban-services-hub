
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  Settings, 
  AlertCircle, 
  BarChart3, 
  Users, 
  MapPin, 
  Building, 
  Shield,
  LogOut,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  {
    title: 'Cadastros',
    icon: Settings,
    role: ['cegor'],
    items: [
      { title: 'Regionais', url: '/cadastros/regionais', icon: Building },
      { title: 'Bairros', url: '/cadastros/bairros', icon: MapPin },
      { title: 'Territórios', url: '/cadastros/territorios', icon: MapPin },
      { title: 'Fiscais', url: '/cadastros/fiscais', icon: Shield },
      { title: 'ZGL', url: '/cadastros/zgl', icon: MapPin },
      { title: 'Equipamentos', url: '/cadastros/equipamentos', icon: Building },
      { title: 'Empresas', url: '/cadastros/empresas', icon: Building },
      { title: 'Equipes', url: '/cadastros/equipes', icon: Users },
    ]
  },
  {
    title: 'Ocorrências',
    icon: AlertCircle,
    role: ['cegor', 'regional', 'empresa'],
    items: [
      { title: 'Lista de Ocorrências', url: '/ocorrencias', icon: AlertCircle },
      { title: 'Nova Ocorrência', url: '/ocorrencias/nova', icon: AlertCircle, role: ['regional'] },
    ]
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    role: ['cegor', 'regional', 'empresa'],
    items: [
      { title: 'Dashboard Geral', url: '/relatorios/dashboard', icon: BarChart3, role: ['cegor'] },
      { title: 'Relatório Regional', url: '/relatorios/regional', icon: BarChart3, role: ['regional'] },
      { title: 'Serviços Programados', url: '/relatorios/programados', icon: BarChart3, role: ['empresa'] },
      { title: 'Tempo de Execução', url: '/relatorios/tempo', icon: BarChart3, role: ['cegor', 'regional'] },
      { title: 'Exportar CSV', url: '/relatorios/csv', icon: BarChart3, role: ['cegor'] },
    ]
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const hasPermission = (roles?: string[]) => {
    if (!roles || !user) return true;
    return roles.includes(user.role);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50';

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-sidebar-primary">CEGOR</h1>
                <p className="text-xs text-sidebar-foreground/70">Sistema de Ocorrências</p>
              </div>
            </div>
          )}
        </div>

        {menuItems.map((group) => (
          hasPermission(group.role) && (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-sidebar-foreground/70">
                {!isCollapsed && group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    hasPermission(item.role) && (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavCls}>
                            <item.icon className="w-4 h-4" />
                            {!isCollapsed && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        ))}

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-sidebar-primary-foreground">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-xs font-medium text-sidebar-primary">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="p-1 hover:bg-sidebar-accent/50 rounded"
              title="Sair"
            >
              <LogOut className="w-4 h-4 text-sidebar-foreground" />
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
