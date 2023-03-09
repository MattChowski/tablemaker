import type React from 'react'

export interface RowObject {
  rowId: number
  values: string[] | []
}

export interface DataObject {
  headers: string[]
  rows: RowObject[]
  dateCreated: number
}

export const getExportData = (tableRef: React.RefObject<HTMLTableElement>) => {
  if (!tableRef.current) return

  const data: DataObject = {
    headers: [],
    rows: [],
    dateCreated: Date.now(),
  }
  const headers = tableRef.current.querySelectorAll('tr')[0].querySelectorAll('.cellValue')
  const rows = tableRef.current.querySelectorAll('tr')

  // get Headers
  const headersArray: string[] = []
  headers.forEach((header) => {
    headersArray.push(header.textContent ?? '')
  })

  // get Rows
  const rowsArray: RowObject[] = []
  Array.from(rows)
    .slice(1)
    .forEach((row, index) => {
      const rowData: RowObject = {
        rowId: index,
        values: [],
      }
      const cells = row.querySelectorAll('.cellValue')

      const cellsArray: string[] = []
      cells.forEach((cell) => {
        cellsArray.push(cell.textContent ?? '')
      })
      rowData.values = cellsArray
      rowsArray.push(rowData)
    })

  data.headers = headersArray
  data.rows = rowsArray

  return data
}