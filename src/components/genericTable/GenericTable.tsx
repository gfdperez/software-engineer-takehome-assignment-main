import { TableHeader } from "@/config/TableConfigs";
import { getComparator, Order } from "@/utils/genericTable/genericTableUtils";
import { Box, Button, ButtonGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { visuallyHidden } from '@mui/utils';
import { useState } from "react";
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Generic table head component
interface GenericTableHeadProps<T> {
  headers: TableHeader<T>[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: Order;
  orderBy: keyof T;
  editable?: boolean;
}

function GenericTableHead<T>({ headers, order, orderBy, onRequestSort, editable }: GenericTableHeadProps<T>) {
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => (
          <TableCell
            key={String(header.id)}
            align={'left'}
            padding="normal"
            sortDirection={orderBy === header.id ? order : false}
          >
            {header.sortable !== false ? (
              <TableSortLabel
                active={orderBy === header.id}
                direction={orderBy === header.id ? order : 'asc'}
                onClick={createSortHandler(header.id)}
              >
                {header.label}
                {orderBy === header.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              header.label
            )}
          </TableCell>
        ))}
        {editable && <TableCell padding="none" align="center"></TableCell>}
      </TableRow>
    </TableHead>
  );
}

// Generic table props
interface GenericTableProps<T> {
  data: T[];
  headers: TableHeader<T>[];
  defaultOrderBy: keyof T;
  defaultOrder?: Order;
  renderCell?: (item: T, key: keyof T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  onRowEdit?: (item: T) => void;
  onRowDelete?: (item: T) => void;
  minWidth?: number;
  editable?: boolean;
}

export default function GenericTable<T extends Record<string, any>>({
  data,
  headers,
  defaultOrderBy,
  defaultOrder = 'desc',
  renderCell,
  onRowClick,
  onRowEdit,
  onRowDelete,
  minWidth = 650,
  editable = false
}: GenericTableProps<T>) {
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...data].sort(getComparator(order, orderBy));

  // Default cell renderer
  const defaultRenderCell = (item: T, key: keyof T): React.ReactNode => {
    const value = item[key];
    
    if (value === null || value === undefined) {
      return '-';
    }

    if (value as {} instanceof Date || (typeof value === 'object' && value !== null && 'getTime' in value)) {
        const dateValue =(value as Date).toLocaleDateString();
        const timeValue = (value as Date).toLocaleTimeString();
        return `${dateValue} ${timeValue}`;
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return String(value);
  };

  const cellRenderer = renderCell || defaultRenderCell;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth }} aria-label="generic table">
        <GenericTableHead 
          headers={headers}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          editable={editable}
        />
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow
              key={item.id || index}
            >
              {headers.map((header) => (
                <TableCell 
                  key={String(header.id)} align={'left'}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  sx={onRowClick ? { cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } } : {}}> 
                    {cellRenderer(item, header.id)}
                </TableCell>
              ))}
              {editable && 
                (<TableCell sx={{ padding: '12px 8px' }} align="center">
                  <ButtonGroup orientation="vertical" variant="outlined" color="primary" size="small" aria-label="Basic button group">
                    <Button onClick={onRowEdit ? () => onRowEdit(item) : undefined}><EditIcon /></Button>
                    <Button onClick={onRowDelete ? () => onRowDelete(item) : undefined}><DeleteIcon /></Button>
                  </ButtonGroup>
                </TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}