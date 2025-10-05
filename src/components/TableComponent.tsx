import { Product } from "@/types"
import { Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { visuallyHidden } from '@mui/utils';
import { useState } from "react";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aVal = a[orderBy];
  const bVal = b[orderBy];
  
  // Handle Date objects
  const aComp = aVal instanceof Date ? aVal.getTime() : aVal;
  const bComp = bVal instanceof Date ? bVal.getTime() : bVal;
  
  if (bComp < aComp) return -1;
  if (bComp > aComp) return 1;
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): <T extends Record<Key, number | string | Date | null>>(a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface ProductHeader {
    id: keyof Product;
    label: string;
}

const productHeaderCells: readonly ProductHeader[] = [
    { id: 'name', label: 'Name' },
    { id: 'sku', label: 'SKU' },
    { id: 'description', label: 'Description' },
    { id: 'price', label: 'Price' },
    { id: 'barcode', label: 'Barcode' },
    { id: 'createdAt', label: 'Created At' },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Product) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Product) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {productHeaderCells.map((productHeader) => (
          <TableCell
            key={productHeader.id}
            align={'left'}
            padding={'normal'}
            sortDirection={orderBy === productHeader.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === productHeader.id}
              direction={orderBy === productHeader.id ? order : 'asc'}
              onClick={createSortHandler(productHeader.id)}
            >
              {productHeader.label}
              {orderBy === productHeader.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


type TableProps = {
    data: Product[]
}

export default function TableComponent({data}: TableProps) {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Product>('createdAt');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Product,
      ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

    const sortedData = data.sort(getComparator(order, orderBy));

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <EnhancedTableHead 
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {data.map((product) => (
                        <TableRow
                            key={product.id}
                        >
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.barcode}</TableCell>
                            <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )    
}