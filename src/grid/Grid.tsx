import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';

import { Box, styled } from '@mui/material';
import type { DataObject } from '@/types';
import GridCell from './GridCell';
import GridHeader from './GridHeader';
import { useGridStore } from '@/stores/gridStore';

interface GridProps {
  exportedData: DataObject | null;
}

const GridTable = styled('table')(() => ({
  border: 0,
  boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.15)'
}));

const defaultColumn: Partial<ColumnDef<any>> = {
  cell: ({ row: { index }, column: { id } }) => (
    <GridCell rowIndex={index} columnId={id} />
  ),
  header: () => <GridHeader data-id='0' initialValue='Header' />
};

const Grid = ({ exportedData }: GridProps) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const { data, columns, setTable, firstColumnIsHeader, setTableRef } =
    useGridStore(
      (state) => ({
        columns: state.columns,
        data: state.data,
        setData: state.setCellData,
        setTable: state.setTable,
        firstColumnIsHeader: state.firstColumnIsHeader,
        setTableRef: state.setTableRef
      }),
      shallow
    );

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel()
  });

  useEffect(() => {
    setTable(table);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      setTableRef(tableRef);
    }
  }, [setTableRef]);

  return (
    <Box
      ref={tableRef}
      sx={{
        padding: '25px'
      }}
    >
      <GridTable
        {...{
          style: {
            width: table.getCenterTotalSize()
          }
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
                      width: header.getSize()
                    }
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  <div
                    {...{
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`
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
                <Box
                  component='td'
                  key={cell.id}
                  data-rowindex={rowIndex}
                  data-cellidex={cellIndex}
                  data-column={`column-${cell.column.id}`}
                  className={`column-${cell.column.id}`}
                  sx={{
                    ...(firstColumnIsHeader && {
                      '&.column-1': {
                        color: '#666666',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        borderRight: '1px solid #ddd',
                        '& > div': {
                          fontWeight: '500',
                          fontSize: '16px',
                          textAlign: 'right',
                          justifyContent: 'right'
                        }
                      }
                    })
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </tr>
          ))}
        </tbody>
      </GridTable>
    </Box>
  );
};

Grid.displayName = 'Grid';

export default Grid;
