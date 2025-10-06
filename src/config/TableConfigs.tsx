import { Product, StockLevel, InventoryLocation } from "@/types";

// Generic types for table headers and data
export interface TableHeader<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
}

export const productTableHeaders: TableHeader<Product>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'sku', label: 'SKU', sortable: true },
  { id: 'description', label: 'Description', sortable: false },
  { id: 'price', label: 'Price', sortable: true },
  { id: 'barcode', label: 'Barcode', sortable: false },
  { id: 'createdAt', label: 'Created At', sortable: true }
];

export const renderProductCell = (product: Product, key: keyof Product): React.ReactNode => {
  const value = product[key];
  
  switch (key) {
    case 'price':
      return typeof value === 'number' ? `$${value.toFixed(2)}` : '-';
    case 'createdAt':
      return value instanceof Date ? 
        (<div className="flex flex-col">
          <span>{value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12:true })}</span>
          <span>{value.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>) : '-';
    case 'description':
      return value && typeof value === 'string' ? 
        (value.length > 50 ? `${value.substring(0, 50)}...` : value) : '-';
    default:
      return value?.toString() || '-';
  }
};

export const stockLevelHeaders: TableHeader<StockLevel>[] = [
  { id: 'location', label: 'Location', sortable: true },
  { id: 'quantity', label: 'Quantity', sortable: true },
  { id: 'minThreshold', label: 'Min Threshold', sortable: true },
  { id: 'updatedAt', label: 'Last Updated', sortable: true },
];

// Custom cell renderer for stock levels
export const renderStockLevelCell = (stockLevel: StockLevel, key: keyof StockLevel): React.ReactNode => {
  const value = stockLevel[key];
  
  switch (key) {
    case 'location':
      // Handle the nested location object
      return stockLevel.location?.name || 'Unknown Location';
    case 'quantity':
      return typeof value === 'number' ? value.toLocaleString() : '-';
    case 'minThreshold':
      return typeof value === 'number' ? value.toLocaleString() : 'Not set';
    case 'updatedAt':
      return value instanceof Date ? 
        (<div className="flex flex-col">
          <span>{value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12:true })}</span>
          <span>{value.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>) : '-';
    default:
      return value?.toString() || '-';
  }
};