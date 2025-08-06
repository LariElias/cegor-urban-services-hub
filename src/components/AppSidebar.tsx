
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
    title: "Cadastros",
    icon: Settings,
    role: ["adm", "cegor"],
    subrole: ["gerente"],
    items: [
      { title: "Regionais", url: "/cadastros/regionais", icon: Building, role: ["adm"] },
      { title: "Bairros", url: "/cadastros/bairros", icon: MapPin, role: ["adm"], },
      { title: "Territórios", url: "/cadastros/territorios", icon: MapPin, role: ["adm"], },
      { title: "Fiscais", url: "/cadastros/fiscais", icon: Shield, role: ["adm"] },
      { title: "Equipamentos", url: "/cadastros/equipamentos", icon: Building, role: ["adm"] },
      { title: "Empresas", url: "/cadastros/empresas", icon: Building, role: ["adm"] },
      { title: "Equipes", url: "/cadastros/equipes", icon: Users, role: ["cegor"], subrole: ["gerente"] },
      { title: "Lista de equipes", url: "/cadastros/equipes/lista", icon: List, role: ["cegor"], subrole: ["gerente"] }
    ],
  },
  {
    title: "Ocorrências",
    icon: AlertCircle,
    role: ["cegor", "regional", "empresa"],
    subrole: ["gestor", "fiscal", "operador", "supervisor", "gerente"],
    items: [
      { title: "Lista", url: "/ocorrencias", icon: FileText },
      { title: "Registrar", url: "/ocorrencias/nova", icon: StickyNote, role: ["regional"], subrole: ["operador"] },
      { title: "Registrar", url: "/ocorrencias/nova", icon: StickyNote, role: ["cegor"], subrole: ["gerente"] },
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
    title: "Relatórios",
    icon: BarChart3,
    role: ["cegor", "regional", "empresa"],
    subrole: ["gestor", "fiscal", "operador", "supervisor", "gerente"],
    items: [
      {
        title: "Dashboard Geral",
        url: "/relatorios/dashboard",
        icon: Activity,
        role: ["cegor"],
        subrole: ["gestor", "gerente"],
      },
      {
        title: "Relatório Regional",
        url: "/relatorios/regional",
        icon: BarChart3,
        role: ["regional", "gerente"],
      },
      {
        title: "Serviços Programados",
        url: "/relatorios/programados",
        icon: Calendar,
        role: ["empresa", "gerente"],
      },
      {
        title: "Exportar CSV",
        url: "/relatorios/csv",
        icon: FileText,
        role: ["cegor", "regional"],
        subrole: ["gestor", "operador", "gerente"],
      },
    ],
  },
  {
    title: "Conta",
    icon: Users,
    role: ["cegor", "regional", "empresa", "adm"],
    items: [
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
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <div className="p-4 border-b border-sidebar-border">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="h-10 flex items-center justify-center"></div>
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

        {menuItems.map(
          (group) =>
            hasPermission(group.role, group.subrole) && (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="text-sidebar-foreground/70 px-4">
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

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center">
            {!isCollapsed && (
              <img
                src={logoCitinova}
                alt="Logo Citinova"
                className="h-6 w-auto logoSide"
              />
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
