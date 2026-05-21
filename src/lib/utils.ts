import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import * as LucideIcons from 'lucide-react';

export function getIconComponent(name: string) {
  const Icon = (LucideIcons as any)[name.charAt(0).toUpperCase() + name.slice(1)] || 
               (LucideIcons as any)[name] || 
               LucideIcons.HelpCircle;
  return Icon;
}
