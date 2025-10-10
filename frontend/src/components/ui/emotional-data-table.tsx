'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronsLeftIcon, 
  ChevronsRightIcon 
} from 'lucide-react'

export interface EmotionalDataTableProps {
  data: any[]
  columns: {
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
  }[]
  emotional?: boolean
  variant?: 'default' | 'luxury' | 'spa' | 'hospitality'
  pageSize?: number
  className?: string
  searchable?: boolean
  sortable?: boolean
  filterable?: boolean
  selectable?: boolean
  selectedRows?: any[]
  onSelectionChange?: (selectedRows: any[]) => void
  onSearch?: (searchTerm: string) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
  }
  actions?: React.ReactNode
}

export function EmotionalDataTable({
  data,
  columns,
  emotional = true,
  variant = 'default',
  pageSize = 10,
  className
}: EmotionalDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = data.slice(startIndex, endIndex)

  const baseClasses = "w-full border-collapse"
  
  const emotionalClasses = emotional ? "animate-fade-in" : ""
  
  const variantClasses = {
    default: "bg-white border-nude-200",
    luxury: "bg-gradient-luxury-gold border-luxury-charlotte",
    spa: "bg-spa-pearl border-spa-silver",
    hospitality: "bg-gradient-warm-hospitality border-hospitality-terracotta"
  }

  const headerClasses = {
    default: "bg-nude-50 text-nude-800 font-semibold",
    luxury: "bg-luxury-charlotte text-white font-semibold",
    spa: "bg-spa-copper text-white font-semibold",
    hospitality: "bg-hospitality-terracotta text-white font-semibold"
  }

  const rowClasses = {
    default: "border-b border-nude-100 hover:bg-nude-50",
    luxury: "border-b border-luxury-charlotte/20 hover:bg-luxury-charlotte/5",
    spa: "border-b border-spa-silver hover:bg-spa-pearl/50",
    hospitality: "border-b border-hospitality-terracotta/20 hover:bg-hospitality-terracotta/5"
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <table className={cn(baseClasses, emotionalClasses, variantClasses[variant])}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium",
                    headerClasses[variant]
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "transition-colors duration-200",
                  rowClasses[variant]
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-nude-700"
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-nude-600">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm text-nude-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}