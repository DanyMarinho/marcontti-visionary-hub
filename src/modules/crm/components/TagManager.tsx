import React, { useState } from 'react';
import { useClienteTags } from '../hooks/useClienteTags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagManagerProps {
  clientId: string;
  currentTags: any[];
}

export function TagManager({ clientId, currentTags }: TagManagerProps) {
  const [tagName, setTagName] = useState('');
  const { tenantTags, addTag, removeTag, createTag, isLoadingTenantTags } = useClienteTags(clientId);

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    
    // Check if tag already exists in tenant
    const existingTag = tenantTags.find((t: any) => t.name.toLowerCase() === tagName.toLowerCase());
    if (existingTag) {
      addTag.mutate(existingTag.id);
    } else {
      createTag.mutate(tagName);
    }
    setTagName('');
  };

  const availableTags = tenantTags.filter(
    (tt: any) => !currentTags.some((ct: any) => ct.id === tt.id)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Tags do Cliente</label>
        <div className="flex flex-wrap gap-2">
          {currentTags.map((tag: any) => (
            <Badge 
              key={tag.id} 
              className="bg-orange-500/10 text-orange-600 border-orange-500/20 px-2 py-1 flex items-center gap-1 group"
            >
              {tag.name}
              <button 
                onClick={() => removeTag.mutate(tag.id)}
                className="hover:bg-orange-500 hover:text-white rounded-full p-0.5 transition-colors"
                aria-label={`Remover tag ${tag.name}`}
              >
                <X size={10} />
              </button>
            </Badge>
          ))}
          {currentTags.length === 0 && (
            <p className="text-xs text-muted-foreground italic">Nenhuma tag atribuída.</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Adicionar Tag</label>
        <form onSubmit={handleCreateTag} className="flex gap-2">
          <Input 
            placeholder="Nome da tag..." 
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="h-9 text-sm"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!tagName.trim() || createTag.isPending || addTag.isPending}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {(createTag.isPending || addTag.isPending) ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          </Button>
        </form>
      </div>

      {availableTags.length > 0 && (
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Tags Sugeridas</label>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag: any) => (
              <button
                key={tag.id}
                onClick={() => addTag.mutate(tag.id)}
                className="text-[10px] px-2 py-1 rounded bg-muted hover:bg-muted-foreground/10 text-muted-foreground transition-colors font-medium border"
              >
                + {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
