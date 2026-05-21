import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GradientButton } from './GradientButton';
import { cn } from '@/lib/utils';

interface DataPlaceholderProps {
  type: 'empty' | 'error';
  title: string;
  description: string;
  icon?: React.ElementType;
  onRetry?: () => void;
  className?: string;
  ctaText?: string;
}

export const DataPlaceholder: React.FC<DataPlaceholderProps> = ({
  type,
  title,
  description,
  icon: Icon,
  onRetry,
  className,
  ctaText
}) => {
  const DefaultIcon = type === 'empty' ? Inbox : AlertCircle;
  const FinalIcon = Icon || DefaultIcon;

  return (
    <GlassCard className={cn("p-12 text-center flex flex-col items-center justify-center border-dashed border-white/10", className)} hover={false}>
      <div className={cn(
        "p-4 rounded-full mb-6",
        type === 'empty' ? "bg-white/5 text-secondary" : "bg-red-500/10 text-red-500"
      )}>
        <FinalIcon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-secondary text-sm max-w-xs mb-8">{description}</p>
      
      {type === 'error' && onRetry && (
        <GradientButton onClick={onRetry} className="w-full max-w-[200px]">
          <RefreshCw className="w-4 h-4 mr-2" /> Tentar Novamente
        </GradientButton>
      )}

      {type === 'empty' && ctaText && onRetry && (
        <GradientButton onClick={onRetry} className="w-full max-w-[200px]">
          {ctaText}
        </GradientButton>
      )}
    </GlassCard>
  );
};
