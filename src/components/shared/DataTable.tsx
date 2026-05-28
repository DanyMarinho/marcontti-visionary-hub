import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronFirst, 
  ChevronLast,
  SearchX
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  columns: {
    header: string;
    accessorKey?: string;
    cell?: (item: any) => React.ReactNode;
    className?: string;
  }[];
  data: any[];
  isLoading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  emptyState?: React.ReactNode;
}

export function DataTable({
  columns,
  data,
  isLoading,
  page = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  emptyState
}: DataTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const renderEmpty = () => {
    if (emptyState) return emptyState;
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <SearchX className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-semibold">Nenhum registro encontrado</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Tente ajustar seus filtros ou busca para encontrar o que procura.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/50">
              {columns.map((col, i) => (
                <TableHead key={i} className={cn("font-bold", col.className)}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {renderEmpty()}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, i) => (
                <TableRow key={item.id || i} className="group transition-colors hover:bg-muted/50">
                  {columns.map((col, j) => (
                    <TableCell key={j} className={col.className}>
                      {col.cell ? col.cell(item) : (col.accessorKey ? item[col.accessorKey] : null)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > pageSize && onPageChange && (
        <div className="flex items-center justify-between px-2">
          <div className="text-xs text-muted-foreground">
            Mostrando <span className="font-medium text-foreground">{(page - 1) * pageSize + 1}</span> a{" "}
            <span className="font-medium text-foreground">{Math.min(page * pageSize, totalCount)}</span> de{" "}
            <span className="font-medium text-foreground">{totalCount}</span> registros
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center text-xs font-medium min-w-[80px]">
              Página {page} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
