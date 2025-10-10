'use client';

import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface EtunaDataTableProps {
  columns: Column[];
  data: any[];
  className?: string;
  striped?: boolean;
  hover?: boolean;
}

export default function EtunaDataTable({
  columns,
  data,
  className = '',
  striped = true,
  hover = true
}: EtunaDataTableProps) {
  const getTableClasses = () => {
    let classes = 'table w-full';
    if (striped) classes += ' table-zebra';
    if (hover) classes += ' hover';
    return classes;
  };

  return (
    <div className="overflow-x-auto">
      <table className={`${getTableClasses()} ${className}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}