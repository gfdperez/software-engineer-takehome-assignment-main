import { trpc } from "@/utils/trpc";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Product } from "@prisma/client";
import GenericTable from "../genericTable/GenericTable";
import { stockLevelHeaders, renderStockLevelCell } from "@/config/TableConfigs";

type ProductViewModalProps = {
  productId: string;
  open: boolean;
  onClose: () => void;
}

export default function ProductViewModal({ productId, open, onClose }: ProductViewModalProps) {
    const { data: productDetails, isLoading, error } = trpc.product.getById.useQuery({ 
        id: productId 
    });

    const totalStock = productDetails?.stockLevels?.reduce((acc, stock) => acc + stock.quantity, 0) ?? 0;

    console.log("Product Details Stock Levels:", productDetails?.stockLevels);
    
    if (isLoading) {
        return (
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Loading...</DialogTitle>
                <DialogContent>
                    <div className="flex justify-center p-4">
                        Loading product details...
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (error || !productDetails) {
        return (
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <div className="flex justify-center p-4">
                        Failed to load product details
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
    
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth={false}
            sx={{
                '& .MuiDialog-paper': {
                    width: { xs: '95vw', sm: '90vw', md: '80vw', lg: '70vw', xl: '60vw' },
                    maxWidth: { xs: '400px', sm: '600px', md: '800px', lg: '1000px', xl: '1200px' },
                    height: { xs: '90vh', sm: '85vh', md: '80vh' },
                    maxHeight: { xs: '90vh', sm: '85vh', md: '80vh' },
                    borderRadius: { xs: '12px', md: '16px' },
                    margin: { xs: '16px', sm: '24px', md: '32px' }
                }
            }}
        >
            <DialogTitle
                sx={{
                    padding: { xs: '16px', sm: '20px', md: '24px' },
                    paddingBottom: { xs: '8px', sm: '12px', md: '16px' }
                }}
            >
                <div className="flex flex-col justify-center gap-1 sm:gap-2">
                    <span 
                        className="font-sans font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                        style={{ 
                            fontSize: 'clamp(1.125rem, 4vw, 2.25rem)',
                            lineHeight: '1.2'
                        }}
                    >
                        {productDetails?.name}
                    </span>
                    <span 
                        className="font-sans text-blue-500 text-xs sm:text-sm md:text-base"
                        style={{ 
                            fontSize: 'clamp(0.75rem, 2.5vw, 1rem)' 
                        }}
                    >
                        Stock: {totalStock} in stock
                    </span>
                </div>
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: { xs: '0 16px 16px', sm: '0 20px 20px', md: '0 24px 24px' },
                    overflowY: 'auto'
                }}
            >
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 mt-2">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Price and SKU Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <div className="flex flex-col gap-1">
                                <span 
                                    className="font-sans text-gray-500 text-xs sm:text-sm"
                                    style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                                >
                                    Price
                                </span>
                                <span 
                                    className="font-sans text-black text-base sm:text-lg md:text-xl"
                                    style={{ 
                                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                                        fontWeight: '600'
                                    }}
                                >
                                    ₱{productDetails?.price.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span 
                                    className="font-sans text-gray-500 text-xs sm:text-sm"
                                    style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                                >
                                    Product SKU
                                </span>
                                <span 
                                    className="font-sans text-black text-base sm:text-lg md:text-xl"
                                    style={{ 
                                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                                        fontWeight: '500',
                                        wordBreak: 'break-all'
                                    }}
                                >
                                    {productDetails?.sku}
                                </span>
                            </div>
                        </div>

                        {/* Date and Barcode Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <div className="flex flex-col gap-1">
                                <span 
                                    className="font-sans text-gray-500 text-xs sm:text-sm"
                                    style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                                >
                                    Time & Date Added
                                </span>
                                <div 
                                    className="flex flex-col font-sans text-black"
                                    style={{ 
                                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                                        fontWeight: '500'
                                    }}
                                >
                                    <span>{productDetails?.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                    <span className="text-xs sm:text-sm" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                                        {productDetails?.createdAt.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span 
                                    className="font-sans text-gray-500 text-xs sm:text-sm"
                                    style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                                >
                                    Barcode
                                </span>
                                <span 
                                    className="font-sans text-black text-base sm:text-lg md:text-xl"
                                    style={{ 
                                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                                        fontWeight: '500',
                                        wordBreak: 'break-all'
                                    }}
                                >
                                    {productDetails?.barcode || "None"}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1">
                            <span 
                                className="font-sans text-gray-500 text-xs sm:text-sm"
                                style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                            >
                                Description
                            </span>
                            <span 
                                className="font-sans text-black text-sm sm:text-base md:text-lg"
                                style={{ 
                                    fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                                    lineHeight: '1.5',
                                    wordWrap: 'break-word'
                                }}
                            >
                                {productDetails?.description || "No Description"}
                            </span>
                        </div>
                    </div>

                    {/* Stock Levels Table */}
                    {productDetails.stockLevels.length > 0 && (
                        <div 
                            className="mt-2 sm:mt-4"
                            style={{
                                fontSize: 'clamp(0.75rem, 2vw, 1rem)'
                            }}
                        >
                            <h3 
                                className="font-sans font-semibold text-gray-700 mb-2 sm:mb-3"
                                style={{ 
                                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                                    marginBottom: 'clamp(8px, 2vw, 12px)'
                                }}
                            >
                                Stock Levels by Location
                            </h3>
                            <div style={{ overflowX: 'auto' }}>
                                <GenericTable
                                    data={productDetails?.stockLevels || []}
                                    headers={stockLevelHeaders}
                                    defaultOrderBy="updatedAt"
                                    defaultOrder="desc"
                                    renderCell={renderStockLevelCell}
                                    minWidth={300}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" onClick={onClose} color="primary" sx={{ m: 1 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}