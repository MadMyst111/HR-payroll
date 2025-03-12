import React from "react";
import { Bell, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../../supabase/auth";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface HRTopNavigationProps {
  onSearch?: (query: string) => void;
}

const HRTopNavigation = ({ onSearch = () => {} }: HRTopNavigationProps) => {
  const { user, signOut } = useAuth();
  const { isRTL } = useLanguage();

  if (!user) return null;

  return (
    <div className="w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 fixed top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64">
          <Search
            className={`absolute ${isRTL ? "right-2" : "left-2"} top-2.5 h-4 w-4 text-muted-foreground`}
          />
          <Input
            placeholder={isRTL ? "بحث..." : "Search..."}
            className={`${isRTL ? "pr-8 text-right" : "pl-8"}`}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRTL ? "الإشعارات" : "Notifications"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRTL ? "الإعدادات" : "Settings"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.email || ""}
                />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {isRTL ? "حسابي" : "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              {isRTL ? "الملف الشخصي" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              {isRTL ? "الإعدادات" : "Settings"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => signOut()}>
              {isRTL ? "تسجيل الخروج" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HRTopNavigation;
