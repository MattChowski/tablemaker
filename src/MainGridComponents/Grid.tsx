/* eslint-disable react/jsx-key */
import React, { useContext, forwardRef } from 'react'

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

import { GridCell, GridTable } from './GridComponents'
import { type ContextType, TableContext } from '@/App'
import { Box } from '@mui/material'
import { type DataObject } from '@/utilities/utils'

interface GridProps {
  exportedData: DataObject | null
}

const Grid = forwardRef<HTMLDivElement, GridProps>(({ exportedData }, ref) => {
  const { data, columns } = useContext(TableContext) as ContextType

  const rawSavedData = localStorage.getItem('tableData')
  const savedData: DataObject = rawSavedData ? JSON.parse(rawSavedData) : null

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Box
      ref={ref}
      sx={{
        padding: '25px',
      }}
    >
      <GridTable
        {...{
          style: {
            width: table.getCenterTotalSize(),
          },
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                  }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  <div
                    {...{
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, cellIndex) => (
                <GridCell
                  initialValue={
                    exportedData?.rows[rowIndex]?.values[cellIndex] ||
                    savedData?.rows?.[rowIndex]?.values[cellIndex] ||
                    ''
                  }
                  data-rowIndex={rowIndex}
                  data-cellIndex={cellIndex}
                  data-column={`column-${cell.column.id}`}
                  {...{
                    key: cell.id,

                    className: `column-${cell.column.id}`,
                    style: {
                      width: cell.column.getSize(),
                    },
                  }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </GridTable>
    </Box>
  )
})

Grid.displayName = 'Grid'

export default Grid