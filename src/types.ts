export interface GridHeaderProps {
  initialValue?: string | null;
}

export interface GridCellProps {
  rowIndex: number;
  columnId: string;
  initialValue?: string;
}

export interface RowObject {
  rowId: number;
  values: string[] | [];
}

export interface DataObject {
  headers: (string | null)[];
  rows: Record<string, string>[];
  dateCreated: number;
}
