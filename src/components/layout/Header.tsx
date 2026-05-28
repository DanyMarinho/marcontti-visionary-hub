import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTenant } from '@/hooks/useTenant';
import { TenantSwitcher } from './TenantSwitcher';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/shared/ThemeProvider';
import { 
  LogOut, 
  Sun, 
  Moon, 
  User as UserIcon,
  ChevronDown,
  Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const { activeTenant, isGlobal } = useTenant();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-20 bg-[#0d0d0d] border-b border-[#1f1f1f] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick} 
          className="lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex flex-col lg:hidden">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none font-sans">
              MEC <span className="text-orange-500">Hub</span>
            </h1>
            <span className="text-[9px] text-[#888888] font-medium uppercase tracking-[0.1em]">by Infinda</span>
          </div>
          <h2 className="text-sm font-semibold text-foreground hidden sm:block">
            {isGlobal ? 'Plataforma MEC Hub' : activeTenant?.name}
          </h2>
        </div>
        
        {user?.role === 'admin' && (
          <div className="hidden sm:block">
            <TenantSwitcher />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground h-9 w-9"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-1 md:px-2 hover:bg-muted rounded-full transition-colors h-9">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[10px] md:text-xs">
                {user?.full_name?.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium leading-none">{user?.full_name}</span>
                <span className="text-[10px] text-muted-foreground uppercase mt-1">
                  {user?.role}
                </span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            {user?.role === 'admin' && (
              <div className="sm:hidden p-2">
                <TenantSwitcher />
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
