import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

type ProductSkeletonProps = {
  columns: number;
};

export default function TableSkeletonLoader({ columns }: ProductSkeletonProps) {
    const skeletonColumns = Array.from({ length: columns });
    const skeletonRows = Array.from({ length: 5 });
  
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {skeletonColumns.map((_, index) => (
                            <TableCell key={index}>
                                <Skeleton variant="text" width="100%" />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {skeletonRows.map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {skeletonColumns.map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton variant="text" width="100%" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
