import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  data: any[];
  filename: string;
  className?: string;
}

export function ExportButton({ data, filename, className }: ExportButtonProps) {
  const exportToCsv = () => {
    if (data.length === 0) {
      toast.error('Não há dados para exportar');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Arquivo exportado com sucesso');
  };

  return (
    <Button variant="outline" size="sm" onClick={exportToCsv} className={className}>
      <Download className="mr-2 h-4 w-4" /> Exportar CSV
    </Button>
  );
}
