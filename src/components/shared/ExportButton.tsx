import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Table as TableIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns?: { header: string; accessorKey: string }[];
  className?: string;
}

export function ExportButton({ data, filename, columns, className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const exportToCsv = () => {
    if (data.length === 0) {
      toast.error('Não há dados para exportar');
      return;
    }

    const headers = columns ? columns.map(c => c.header).join(',') : Object.keys(data[0]).join(',');
    const rows = data.map(row => {
      if (columns) {
        return columns.map(c => {
          const val = row[c.accessorKey];
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(',');
      }
      return Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',');
    });
    
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
    
    toast.success('CSV exportado com sucesso');
  };

  const exportToPdf = async () => {
    if (data.length === 0) {
      toast.error('Não há dados para exportar');
      return;
    }

    try {
      setIsExporting(true);
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text(filename.replace(/_/g, ' ').toUpperCase(), 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

      const tableColumn = columns ? columns.map(c => c.header) : Object.keys(data[0]);
      const tableRows = data.map(row => {
        if (columns) {
          return columns.map(c => row[c.accessorKey]);
        }
        return Object.values(row);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] }, // MEC Orange
      });

      doc.save(`${filename}.pdf`);
      toast.success('PDF exportado com sucesso');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportToCsv} className={className} disabled={isExporting}>
        <TableIcon className="mr-2 h-4 w-4" /> CSV
      </Button>
      <Button variant="outline" size="sm" onClick={exportToPdf} className={className} disabled={isExporting}>
        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
        PDF
      </Button>
    </div>
  );
}
