import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, Bell } from 'lucide-react';
import { create } from 'zustand';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'info' | 'notification';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  icon?: React.ReactNode;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(2, 9) }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
}));

export const ToastNotification: React.FC<Toast & { onClose: (id: string) => void }> = ({
  id,
  message,
  type,
  icon,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-400 w-5 h-5" />,
    info: <Info className="text-blue-400 w-5 h-5" />,
    notification: <Bell className="text-purple-400 w-5 h-5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={cn(
        'glass-card-glow flex items-center gap-3 p-4 min-w-[300px] mb-3 pointer-events-auto border-l-4',
        type === 'success' && 'border-green-500',
        type === 'info' && 'border-blue-500',
        type === 'notification' && 'border-purple-500'
      )}
    >
      <div className="flex-shrink-0">{icon || icons[type]}</div>
      <div className="flex-grow text-sm font-medium text-white">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-[9999] pointer-events-none flex flex-col items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
