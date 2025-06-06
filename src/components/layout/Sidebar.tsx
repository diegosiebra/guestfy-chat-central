
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  CalendarDays,
  MessageSquare,
  Bot,
  BookOpen,
  DollarSign,
  Home,
  Settings,
  Building2,
  Users,
  ClipboardCheck,
  BriefcaseBusiness,
  ShieldCheck,
  FileCheck,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const navigationItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: Home,
    },
    {
      title: "Reservas",
      path: "/reservations",
      icon: CalendarDays,
    },
    {
      title: "Propriedades",
      path: "/properties",
      icon: Building2,
    },
    {
      title: "Chat",
      path: "/chats",
      icon: MessageSquare,
    },
    {
      title: "Agentes IA",
      path: "/agents",
      icon: Bot,
    },
    {
      title: "Base de Conhecimento",
      path: "/knowledge-base",
      icon: BookOpen,
    },
    {
      title: "Financeiro",
      path: "/financials",
      icon: DollarSign,
    },
  ];

  const managerTaskItems = [
    {
      title: "Equipe",
      path: "/team",
      icon: Users,
    },
    {
      title: "Tarefas",
      path: "/tasks",
      icon: ClipboardCheck,
    },
    {
      title: "Contratos",
      path: "/contracts",
      icon: FileCheck,
    },
    {
      title: "Permissões",
      path: "/permissions",
      icon: ShieldCheck,
    },
    {
      title: "Relatórios",
      path: "/reports",
      icon: BriefcaseBusiness,
    },
  ];

  const isActive = (path: string): boolean => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <SidebarComponent>
      <SidebarContent>
        <div className="py-4 px-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">Guestfy</h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={isActive(item.path) ? "bg-sidebar-accent text-white" : ""}
                    asChild
                  >
                    <NavLink to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerTaskItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={isActive(item.path) ? "bg-sidebar-accent text-white" : ""}
                    asChild
                  >
                    <NavLink to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pb-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/settings">
                      <Settings className="h-5 w-5" />
                      <span>Configurações</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
