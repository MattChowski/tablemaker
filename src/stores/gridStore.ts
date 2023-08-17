import { create, StateCreator } from 'zustand';
import type { ColumnDef, Table } from '@tanstack/react-table';
import { DataObject } from '@/types';

type GridVisualState = {
  cellPadding: number;
  setCellPadding: (newPadding: number) => void;
  firstColumnIsHeader: boolean;
  setFirstColumnIsHeader: (isHeader: boolean) => void;
  centerCell: boolean;
  setCenterCell: (isCenter: boolean) => void;
};

type GridDataState = {
  data: Record<string, string>[];
  columns: Array<ColumnDef<any, unknown>>;
  setCellData: (rowIndex: number, columnId: string, value: string) => void;
  setData: (rows: Record<string, string>[]) => void;
  setColumns: (newColumns: Array<ColumnDef<any, unknown>>) => void;
  addColumn: () => void;
  removeColumn: () => void;
  addRow: () => void;
  removeRow: () => void;
  exportedData: DataObject | null;
  table: Table<any> | null;
  setTable: (table: Table<any>) => void;
  tableRef: React.RefObject<HTMLTableElement> | null;
  setTableRef: (tableRef: React.RefObject<HTMLTableElement>) => void;
};

const createGridVisualState: StateCreator<
  GridVisualState & GridDataState,
  [],
  [],
  GridVisualState
> = (set) => ({
  cellPadding: 6,
  firstColumnIsHeader: false,
  centerCell: false,
  cellPaddingRef: { current: 6 },
  setCellPadding: (newNumber) => set(() => ({ cellPadding: newNumber })),
  setFirstColumnIsHeader: (isHeader) =>
    set(() => ({ firstColumnIsHeader: isHeader })),
  setCenterCell: (isCenter) => set(() => ({ centerCell: isCenter }))
});

const createGridDataState: StateCreator<
  GridVisualState & GridDataState,
  [],
  [],
  GridDataState
> = (set) => ({
  data: [],
  columns: [
    {
      id: '1'
    }
  ],
  exportedData: null,
  table: null,
  setData: (rows) => set({ data: rows }),
  setCellData: (rowIndex, columnId, value) =>
    set((previousState) => {
      console.log({ rowIndex, columnId, value });
      const newData = [...previousState.data];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value
      };

      return {
        data: newData
      };
    }),
  addColumn: () =>
    set((prevState) => ({
      columns: [
        ...prevState.columns,
        {
          id: `${prevState.columns.length + 1}`
        }
      ]
    })),
  removeColumn: () =>
    set((prevState) => ({
      columns:
        prevState.columns.length > 1
          ? prevState.columns.slice(0, -1)
          : prevState.columns
    })),
  setColumns: (newColumns) => set({ columns: newColumns }),
  addRow: () =>
    set((prevState) => ({
      data: [...prevState.data, {}]
    })),
  removeRow: () =>
    set((prevState) => ({
      data:
        prevState.data.length > 1 ? prevState.data.slice(0, -1) : prevState.data
    })),
  setTable: (newTable) => set({ table: newTable }),
  tableRef: null,
  setTableRef: (tableRef) => {
    set({ tableRef: tableRef });
  }
});

export const useGridStore = create<GridVisualState & GridDataState>()(
  (...a) => ({
    ...createGridVisualState(...a),
    ...createGridDataState(...a)
  })
);
