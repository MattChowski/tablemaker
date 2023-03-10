import React, { useState, createContext, useRef, useEffect } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { Box } from '@mui/material'

import Grid from '@/grid/Grid'
import { GridCell, GridHeader } from '@/grid/GridComponents'
import Sidebar from '@/MainSideBar/Sidebar'
import { type DataObject } from '@/utilities/utils'

export interface ContextType {
  cellPadding: number
  firstColumnIsHeader: boolean
  centerCell: boolean
  data: null[]
  columns: Array<ColumnDef<any, unknown>>
  tableRef: React.RefObject<HTMLTableElement>
  setCellPadding: React.Dispatch<React.SetStateAction<number>>
  setFirstColumnIsHeader: React.Dispatch<React.SetStateAction<boolean>>
  setCenterCell: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<null[]>>
  setColumns: React.Dispatch<
    React.SetStateAction<Array<ColumnDef<any, unknown>>>
  >
  exportedData: DataObject | null
}

const initialColumns: Array<ColumnDef<any>> = [
  {
    id: '1',
    cell: (info) => info.getValue(),
    header: () => <GridHeader data-id='0' initialValue='Header' />,
  },
]

export const TableContext = createContext<ContextType | null>(null)

const App = () => {
  const rawSavedData = localStorage.getItem('tableData')
  const savedData: DataObject = rawSavedData ? JSON.parse(rawSavedData) : null

  const [data, setData] = useState(() => {
    if (savedData) {
      return Array(savedData.rows.length).fill(null)
    }
    return [null]
  })

  const [columns, setColumns] = useState(() => {
    if (savedData) {
      const newHeaders: Array<ColumnDef<any>> = savedData.headers.map(
        (header, index) => ({
          id: `${index + 1}`,
          cell: (info) => <GridCell initialValue='lol' />,
          header: () => (
            <GridHeader data-id={`${index + 1}`} initialValue={header} />
          ),
        })
      )
      return newHeaders
    }
    return initialColumns
  })
  const [cellPadding, setCellPadding] = useState(4)
  const [firstColumnIsHeader, setFirstColumnIsHeader] = useState(false)
  const [centerCell, setCenterCell] = useState(false)
  const [exportedData, setExportData] = useState<DataObject | null>(null)

  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    console.log({ exportedData })
  })

  return (
    <TableContext.Provider
      value={{
        cellPadding,
        firstColumnIsHeader,
        centerCell,
        data,
        columns,
        tableRef,
        setCellPadding,
        setFirstColumnIsHeader,
        setCenterCell,
        setData,
        setColumns,
        exportedData,
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Sidebar setExportData={setExportData} exportedData={exportedData} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: '1',
          }}
        >
          <Grid ref={tableRef} exportedData={exportedData} />
        </Box>
      </Box>
    </TableContext.Provider>
  )
}

export default App
