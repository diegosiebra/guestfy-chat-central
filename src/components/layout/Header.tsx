
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Building, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { user, selectedCompany, logout } = useAuth();
  const navigate = useNavigate();
  const unreadNotifications = 2;

  const canCreateMoreCompanies = user?.companies.length < 2;

  return (
    <header className="bg-white border-b border-border h-16 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold hidden md:block">Guestfy Manager</h1>
          {selectedCompany && (
            <>
              <span className="hidden md:inline mx-1">|</span>
              <div className="flex items-center gap-2 text-sm">
                {selectedCompany.logo ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedCompany.logo} alt={selectedCompany.name} />
                    <AvatarFallback>{selectedCompany.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Building className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium">{selectedCompany.name}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">New reservation</span>
                <span className="text-sm text-muted-foreground">John Doe booked Room 101</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">Message received</span>
                <span className="text-sm text-muted-foreground">New chat message from Sarah</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>{user?.name.substring(0, 2) || "GM"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Guest Manager"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "manager@guestfy.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/select-company")}>
              Switch Company
            </DropdownMenuItem>
            {canCreateMoreCompanies && (
              <DropdownMenuItem onClick={() => navigate("/create-company")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Company
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
