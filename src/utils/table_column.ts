import { ComponentChild } from "preact";

interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
  format?: (value: number) => string;
  customRender?: (value: any) => ComponentChild
}

export default TableColumn;