import { Box, Typography } from "@mui/material";

export default function ProductsEmptyState() {
    return (
        <Box textAlign="center" py={4}>
            <Typography variant="h6" color="grey">
                No products yet. Click the <span className="font-bold text-blue-500"> "Add Product" </span> button to create your first product.
            </Typography>
        </Box>
    );
}