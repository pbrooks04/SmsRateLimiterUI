import React, { useCallback } from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  type SortingState,
  type Table,
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'

import { fetchSmsHistory } from '../api';
import { StatusDot } from '../components'

interface HistoryEntry {
  smsRequest: {
    accountId: string
    phoneNumber: string
    message: string
  },
  date: string
  status: 'success' | 'rejected'
}

const columnHelper = createColumnHelper<HistoryEntry>()

const columns = [
  columnHelper.accessor(row => row.date, {
    id: 'date',
    cell: info => {
      const dateString = info.getValue()
      const dateObject = new Date(dateString)
      return dateObject.toISOString()
    },
    header: () => <span>Date</span>,
    sortingFn: 'datetime',
  }),
  columnHelper.accessor(row => row.smsRequest.accountId, {
    id: 'accountId',
    cell: info => info.getValue(),
    header: () => <span>Account ID/Provider</span>,
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor(row => row.smsRequest.phoneNumber, {
    id: 'phoneNumber',
    cell: info => info.getValue(),
    header: () => <span>Phone Number</span>,
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor(row => row.smsRequest.message, {
    id: 'message',
    cell: info => info.getValue(),
    header: () => <span>Message</span>,
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor(row => row.status, {
    id: 'status',
    cell: info => <StatusDot status={info.getValue()} />,
    header: () => <span>Status</span>,
  })
]

const sortOptions = [
  { id: 'date', label: 'Date' },
  { id: 'message', label: 'Message' },
  { id: 'accountId', label: 'Account ID' },
  { id: 'phoneNumber', label: 'Phone Number' },
]

export function History() {
  const { data, /* isFetching, error */ } = useQuery<HistoryEntry[]>({
    queryKey: ['History'],
    queryFn: fetchSmsHistory,
    // Automatically refetch every half a second.
    refetchInterval: 500,
  })

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])


  const handleSortToggle = useCallback((columnId: string) => {
      setSorting(prev => {
        const existing = prev.find(s => s.id === columnId)
        if (existing) {
          // Remove it from the sorting list.
          return prev.filter(s => s.id !== columnId)
        } else {
          // Add it to end of sort chain. Always sorting by ascending values.
          return [...prev, { id: columnId, desc: false }]
        }
      })
    }, [setSorting])

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div>
      <SortBy
        sortOptions={sortOptions}
        sorting={sorting}
        handleSortToggle={handleSortToggle}
      />
      <FilterBy table={table} />

      <table style={{ borderSpacing: '8px' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}

interface SortByProps {
  sortOptions: {
    id: string
    label: string
  }[]
  sorting: SortingState
  handleSortToggle: (sortId: string) => void
}

const SortBy = ({
  sortOptions,
  sorting,
  handleSortToggle
}: SortByProps) => {
  return (
    <div style={{ margin: '1rem' }}>
      <strong>Sort By:</strong>
      {sortOptions.map(option => (
        <label key={option.id} style={{ marginLeft: '1rem' }}>
          <input
            type='checkbox'
            checked={sorting.some(s => s.id === option.id)}
            onChange={() => handleSortToggle(option.id)}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}

interface FilterByProps {
  table: Table<HistoryEntry>
}

const FilterBy = ({
  table,
}: FilterByProps) => {
  return (
    <div style={{ margin: '1rem 0' }}>
        <strong>Filter By:</strong>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <input
            placeholder='Filter Account ID'
            value={table.getColumn('accountId')?.getFilterValue() as string || ''}
            onChange={e =>
              table.getColumn('accountId')?.setFilterValue(e.target.value)
            }
          />
          <input
            placeholder='Filter Phone Number'
            value={table.getColumn('phoneNumber')?.getFilterValue() as string || ''}
            onChange={e =>
              table.getColumn('phoneNumber')?.setFilterValue(e.target.value)
            }
          />
          <input
            placeholder='Filter Message'
            value={table.getColumn('message')?.getFilterValue() as string || ''}
            onChange={e =>
              table.getColumn('message')?.setFilterValue(e.target.value)
            }
          />
          <select
            value={table.getColumn('status')?.getFilterValue() as string || ''}
            onChange={e =>
              table.getColumn('status')?.setFilterValue(e.target.value || undefined)
            }
          >
            <option value=''>All Statuses</option>
            <option value='success'>Success</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>
      </div>
  )
}
