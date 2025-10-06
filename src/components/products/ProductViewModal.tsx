import { trpc } from "@/utils/trpc";
import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={"xs"}>
            <DialogTitle>
                <div className="flex flex-col justify-center sm:justify-between sm:gap-2">
                    <span className="font-sans font-bold text-2xl sm:text-4xl">{productDetails?.name}</span>
                    <span className="font-sans text-green-500 text-xs sm:text-sm">Stock: {totalStock} in stock</span>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                             <div className="flex flex-col">
                                <span className="font-sans text-gray-500 text-sm">Price</span>
                                <span className="font-sans text-black-500 text-lg">₱{productDetails?.price.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-sans text-gray-500 text-sm">Product SKU</span>
                                <span className="font-sans text-black-500 text-lg">{productDetails?.sku}</span>
                            </div>
                            
                            
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="flex flex-col ">
                                <span className="font-sans text-gray-500 text-sm">Time & Date Added</span>
                                <span className="flex flex-col font-sans text-black-500 text-md">
                                    <span>{productDetails?.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12:true })}</span>
                                    <span>{productDetails?.createdAt.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </span>
                            </div>
                            <div className="flex flex-col ">
                                <span className="font-sans text-gray-500 text-sm">Barcode</span>
                                <span className="font-sans text-black-500 text-lg">{productDetails?.barcode ? productDetails?.barcode : "None"}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-sans text-gray-500 text-sm">Description</span>
                            <span className="font-sans text-black-500 text-lg">{productDetails?.description ? productDetails?.description : "No Description"}</span>
                        </div>
                    </div>
                    {productDetails.stockLevels.length > 0 && (
                        <GenericTable
                            data={productDetails?.stockLevels || []}
                            headers={stockLevelHeaders}
                            defaultOrderBy="updatedAt"
                            defaultOrder="desc"
                            renderCell={renderStockLevelCell}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}