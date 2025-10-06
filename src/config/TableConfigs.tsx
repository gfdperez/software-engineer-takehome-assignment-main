import { Product, InventoryLocation } from "@/types";
import { TableHeader } from "@/components/genericTable/GenericTable";

// Product Table Configuration
export const productTableHeaders: TableHeader<Product>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'sku', label: 'SKU', sortable: true },
  { id: 'description', label: 'Description', sortable: false },
  { id: 'price', label: 'Price', sortable: true },
  { id: 'barcode', label: 'Barcode', sortable: false },
  { id: 'createdAt', label: 'Created At', sortable: true }
];

// Custom cell renderer for products (optional)
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

// Location Table Configuration (Example of reusability)
export const locationTableHeaders: TableHeader<InventoryLocation>[] = [
  { id: 'name', label: 'Location Name', sortable: true },
  { id: 'address', label: 'Address', sortable: false },
  { id: 'contactPerson', label: 'Contact Person', sortable: true },
  { id: 'contactNumber', label: 'Phone', sortable: false },
  { id: 'createdAt', label: 'Created At', sortable: true }
];

// Custom cell renderer for locations
export const renderLocationCell = (location: InventoryLocation, key: keyof InventoryLocation): React.ReactNode => {
  const value = location[key];
  
  switch (key) {
    case 'createdAt':
      return value instanceof Date ? value.toLocaleDateString() : 
             typeof value === 'string' ? new Date(value).toLocaleDateString() : '-';
    case 'address':
      return value && typeof value === 'string' ? 
        (value.length > 40 ? `${value.substring(0, 40)}...` : value) : 'No address';
    default:
      return value?.toString() || '-';
  }
};