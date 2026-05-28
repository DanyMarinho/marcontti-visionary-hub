import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

interface StageConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { value: number }) => void;
  title: string;
  description: string;
}

export function StageConfirmationDialog({ open, onOpenChange, onConfirm, title, description }: StageConfirmationDialogProps) {
  const [value, setValue] = useState('');
  const [closingDate, setClosingDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="final_value">Valor Final do Fechamento (R$)</Label>
            <Input 
              id="final_value" 
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00" 
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="closing_date">Data de Fechamento</Label>
            <Input 
              id="closing_date" 
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onConfirm({ value: Number(value), date: closingDate })}
          >
            Confirmar Fechamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
