import React from "react";
import { useLocation, NavLink } from "react-router-dom";
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
  MapPin as MapPinIcon,
  CheckCircle,
  Briefcase,
  StickyNote,
  List
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import {
  isRegionalGestor,
  isRegionalOperador,
  isRegionalFiscal,
  isCegorGestor,
  isCegorOperador,
} from "@/types";
import logoPmf from "@/assets/images/logo-pmf-2025.png";
import logoCitinova from "@/assets/images/logo-citinova-color.png";

const menuItems = [  
  {
    title: "Ocorrências",
    icon: AlertCircle,
    role: ["cegor", "regional", "empresa"],
    subrole: ["gestor", "fiscal", "operador", "supervisor", "gerente"],
    items: [
      { title: "Lista", url: "/ocorrencias", icon: FileText },
      { title: "Registrar", url: "/ocorrencias/nova", icon: StickyNote, role: ["regional", "cegor"], subrole: ["operador", "gerente"] },

      // { title: 'Aprovadas', url: '/ocorrencias/aprovadas', icon: CheckCircle, role: ['cegor'] },
      // { title: 'Demandas da Empresa', url: '/ocorrencias/demandas', icon: Briefcase, role: ['empresa'] },
      {
        title: "Mapa",
        url: "/relatorios/mapa",
        icon: MapPin,
        role: ["cegor", "regional"],
        subrole: ["gestor", "gerente"],
      },
    ],
  },
  {
    title: "Equipes",
    icon: AlertCircle,
    role: ["adm", "cegor"],
    subrole: ["gerente"],
    items: [
      { title: "Lista", url: "/equipes", icon: FileText },
      { title: "Registrar", url: "/equipes/cadastro", icon: StickyNote, role: ["regional", "cegor"], subrole: ["operador", "gerente"] },
    ],
  },
  {
    title: "Cadastros",
    icon: Settings,
    role: ["adm", "cegor"],
    subrole: ["adm", "gerente"],
    items: [
      { title: "Regionais", url: "/cadastros/regionais", icon: Building, role: ["adm"] },
      { title: "Bairros", url: "/cadastros/bairros", icon: MapPin, role: ["adm"], },
      { title: "Territórios", url: "/cadastros/territorios", icon: MapPin, role: ["adm"], },
      { title: "Fiscais", url: "/cadastros/fiscais", icon: Shield, role: ["adm"] },
      { title: "Equipamentos", url: "/cadastros/equipamentos", icon: Building, role: ["cegor","adm"], subrole:["gerente"] },
      { title: "Empresas", url: "/cadastros/empresas", icon: Building, role: ["adm"] },
    ],
  },

  // {
  //   title: "Relatórios",
  //   icon: BarChart3,
  //   role: ["cegor", "regional"],
  //   subrole: ["gestor", "supervisor", "gerente"],
  //   items: [
  //     {
  //       title: "Dashboard Geral",
  //       url: "/relatorios/dashboard",
  //       icon: Activity,
  //       role: ["cegor"],
  //       subrole: ["gestor", "gerente"],
  //     },
  //     // { title: 'Tempo de Execução', url: '/relatorios/tempo', icon: Clock, role: ['cegor', 'regional'], subrole: ['gestor'] },
  //     // { title: 'Mapa de Ocorrências', url: '/relatorios/mapa', icon: MapPin, role: ['cegor'] },
  //     // {
  //     //   title: "Serviços Programados",
  //     //   url: "/relatorios/programados",
  //     //   icon: Calendar,
  //     //   role: ["empresa", "gerente"],
  //     // },
  //     {
  //       title: "Exportar CSV",
  //       url: "/relatorios/csv",
  //       icon: FileText,
  //       role: ["cegor", "regional"],
  //       subrole: ["gestor", "gerente"],
  //     },
  //   ],
  // },
  {
    title: "Conta",
    icon: Users,
    role: ["cegor", "regional", "empresa", "adm"],
    items: [
      // alterar a rota de conta -> entender depois o que precisa aparecer
      { title: "Configurações", url: "/teste", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const hasPermission = (roles?: string[], subroles?: string[]) => {
    if (!roles || !user) return true;

    const roleMatch = roles.includes(user.role);
    if (!roleMatch) return false;

    if (subroles && user.subrole) {
      return subroles.includes(user.subrole);
    }

    return true;
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-white/20 text-gray-700 font-medium"
      : "hover:bg-white/10 text-white/90";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-gray-200 text-white">
        <div className="p-4 border-b border-white/20">
          <NavLink to="/" className="flex items-center justify-center gap-3">

            {!isCollapsed && (
              <div>
                <img
                  src={logoPmf}
                  alt="Logo pmf"
                  className="h-10 w-auto logoSide"
                />
              </div>
            )}
          </NavLink>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className={getNavCls}>
                    <Home className="w-5 h-5" />
                    {!isCollapsed && <span>Início</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {menuItems.map(
          (group) =>
            hasPermission(group.role, group.subrole) && (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="text-gray-500">
                  {!isCollapsed && group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(
                      (item) =>
                        hasPermission(item.role, item.subrole) && (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <NavLink to={item.url} className={getNavCls}>
                                <item.icon className="w-5 h-5" />
                                {!isCollapsed && <span>{item.title}</span>}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
        )}

        <div className="mt-auto p-4 border-t border-white/20">
          <div className="flex flex items-center justify-center gap-3">
            {/* <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-white/70 capitalize">
                  {user?.role} {user?.subrole && `- ${user.subrole}`}
                </p>
              </div>
            )}
            <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button> */}
            {!isCollapsed && (
              <img
                src={logoCitinova}
                alt="Logo pmf"
                className="h-6 w-auto logoSide"
              />
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
