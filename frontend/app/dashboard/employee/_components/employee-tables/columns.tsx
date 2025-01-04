'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'fullName',
    header: 'Name'
  },
  {
    accessorKey: 'username',
    header: 'Username'
  },
  {
    accessorKey: 'tasksCount',
    header: 'Tasks count'
  },
  {
    accessorKey: 'actionsCount',
    header: 'Actions Count'
  },
];
