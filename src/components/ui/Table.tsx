import React from 'react';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display.',
  sortKey,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortKey === key) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    onSort(key, newDirection);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        <Skeleton variant="line" className="h-10 w-full" />
        <Skeleton variant="table-row" className="h-12 w-full" />
        <Skeleton variant="table-row" className="h-12 w-full" />
        <Skeleton variant="table-row" className="h-12 w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full flex flex-col">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto w-full border border-border rounded-lg bg-surface">
        <table className="min-w-full divide-y divide-border text-left text-sm text-textSecondary">
          <thead className="bg-surfaceAlt text-textPrimary font-semibold select-none">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  className={`px-6 py-4 ${col.sortable ? 'cursor-pointer hover:bg-border/60 transition-colors' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && sortKey === col.key && (
                      <span className="text-primary font-bold">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface text-textSecondary">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-surfaceAlt/30 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="block md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-surface border border-border rounded-lg p-4 shadow-card space-y-3">
            {columns.map((col) => (
              <div key={String(col.key)} className="flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-textMuted select-none uppercase">
                  {col.label}
                </span>
                <span className="text-sm font-medium text-textPrimary text-right">
                  {col.render ? col.render(row) : row[col.key as keyof T]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      {currentPage !== undefined && totalPages !== undefined && onPageChange && (
        <div className="flex items-center justify-between px-2 py-4 border-t border-border mt-4 text-sm text-textSecondary select-none">
          <div>
            Showing Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 bg-surface border border-border rounded-md hover:bg-surfaceAlt active:bg-border/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 bg-surface border border-border rounded-md hover:bg-surfaceAlt active:bg-border/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Table;
