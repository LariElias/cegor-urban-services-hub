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
  Home,
  FileText,
  Calendar,
  Activity,
  Clock,
  History,
  MapPin as MapPinIcon
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
    ]
  },
  {
    title: 'Ocorrências',
    icon: AlertCircle,
    role: ['cegor', 'regional', 'empresa'],
    items: [
      { title: 'Lista de Ocorrências', url: '/ocorrencias', icon: FileText },
      { title: 'Nova Ocorrência', url: '/ocorrencias/nova', icon: AlertCircle, role: ['regional'] },
    ]
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    role: ['cegor', 'regional', 'empresa'],
    items: [
      { title: 'Dashboard Geral', url: '/relatorios/dashboard', icon: Activity, role: ['cegor'] },
      { title: 'Tempo de Execução', url: '/relatorios/tempo', icon: Clock, role: ['cegor', 'regional'] },
      { title: 'Mapa de Ocorrências', url: '/relatorios/mapa', icon: MapPin, role: ['cegor'] },
      { title: 'Histórico', url: '/relatorios/historico', icon: History, role: ['cegor', 'regional', 'empresa'] },
      { title: 'Relatório Regional', url: '/relatorios/regional', icon: BarChart3, role: ['regional'] },
      { title: 'Serviços Programados', url: '/relatorios/programados', icon: Calendar, role: ['empresa'] },
      { title: 'Exportar CSV', url: '/relatorios/csv', icon: FileText, role: ['cegor'] },
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
    isActive ? 'bg-white/20 text-white font-medium' : 'hover:bg-white/10 text-white/90';

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-[#0B5CF0] text-white">
        <div className="p-4 border-b border-white/20">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-white">CEGOR</h1>
                <p className="text-sm text-white/70">Sistema de Ocorrências</p>
              </div>
            )}
          </NavLink>
        </div>

        <div className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className={getNavCls}>
                  <Home className="w-5 h-5" />
                  {!isCollapsed && <span>Dashboard</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {menuItems.map((group) => (
          hasPermission(group.role) && (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-white/70 px-4">
                {!isCollapsed && group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    hasPermission(item.role) && (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavCls}>
                            <item.icon className="w-5 h-5" />
                            {!isCollapsed && <span>{item.title}</span>}
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

        <div className="mt-auto p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-white/70 capitalize">{user?.role}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
