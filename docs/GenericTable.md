# Generic Table Component

A reusable table component that works with any data type and provides sorting, custom rendering, and flexible configuration.

## Features

- **Generic/Type-safe**: Works with any TypeScript type
- **Sortable columns**: Enable/disable sorting per column
- **Custom cell rendering**: Control how data is displayed
- **Flexible styling**: Column alignment, width, and Material-UI theming
- **Row interactions**: Optional click handlers
- **Responsive**: Built on Material-UI components

## Basic Usage

```tsx
import GenericTable from '@/components/GenericTable';
import { TableHeader } from '@/components/GenericTable';

// Define your data type
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Define table headers
const userHeaders: TableHeader<User>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'createdAt', label: 'Created', sortable: true }
];

// Use the table
<GenericTable
  data={users}
  headers={userHeaders}
  defaultOrderBy="createdAt"
  defaultOrder="desc"
/>
```

## Advanced Usage

### Custom Cell Rendering

```tsx
const renderUserCell = (user: User, key: keyof User): React.ReactNode => {
  switch (key) {
    case 'email':
      return <a href={`mailto:${user.email}`}>{user.email}</a>;
    case 'createdAt':
      return user.createdAt.toLocaleDateString();
    default:
      return user[key]?.toString() || '-';
  }
};

<GenericTable
  data={users}
  headers={userHeaders}
  defaultOrderBy="createdAt"
  renderCell={renderUserCell}
/>
```

### Row Click Handlers

```tsx
const handleRowClick = (user: User) => {
  router.push(`/users/${user.id}`);
};

<GenericTable
  data={users}
  headers={userHeaders}
  defaultOrderBy="name"
  onRowClick={handleRowClick}
/>
```

## Header Configuration

```tsx
interface TableHeader<T> {
  id: keyof T;           // Column key (must be a property of your data type)
  label: string;         // Display name
  sortable?: boolean;    // Enable sorting (default: true)
  align?: 'left' | 'right' | 'center'; // Text alignment (default: 'left')
  width?: string | number; // Column width
}
```

## Props

```tsx
interface GenericTableProps<T> {
  data: T[];                           // Array of data items
  headers: TableHeader<T>[];           // Column configuration
  defaultOrderBy: keyof T;             // Initial sort column
  defaultOrder?: 'asc' | 'desc';       // Initial sort direction (default: 'desc')
  renderCell?: (item: T, key: keyof T) => React.ReactNode; // Custom cell renderer
  onRowClick?: (item: T) => void;      // Row click handler
  minWidth?: number;                   // Table minimum width (default: 650)
}
```

## Examples in the Codebase

### Products Table
```tsx
// src/config/tableConfigs.tsx
export const productTableHeaders: TableHeader<Product>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'sku', label: 'SKU', sortable: true },
  { id: 'price', label: 'Price', sortable: true, align: 'right' },
  // ...
];

// src/pages/products/index.tsx
<GenericTable 
  data={products?.products || []} 
  headers={productTableHeaders}
  defaultOrderBy="createdAt"
  defaultOrder="desc"
  renderCell={renderProductCell}
/>
```

### Locations Table
```tsx
// src/config/tableConfigs.tsx
export const locationTableHeaders: TableHeader<InventoryLocation>[] = [
  { id: 'name', label: 'Location Name', sortable: true },
  { id: 'address', label: 'Address', sortable: false },
  // ...
];

// Usage
<GenericTable 
  data={locations} 
  headers={locationTableHeaders}
  defaultOrderBy="name"
  renderCell={renderLocationCell}
/>
```

## Migration from Specific Table Components

To migrate from a specific table component like `TableComponent`:

1. **Create header configuration** in `src/config/tableConfigs.tsx`
2. **Create custom cell renderer** (optional) for special formatting
3. **Replace the component** in your page:
   ```tsx
   // Before
   <TableComponent data={products} />
   
   // After
   <GenericTable 
     data={products}
     headers={productTableHeaders}
     defaultOrderBy="createdAt"
     renderCell={renderProductCell}
   />
   ```

## Benefits

- **Consistency**: All tables follow the same patterns
- **Maintainability**: Single component to maintain and update
- **Type Safety**: Full TypeScript support with generic types
- **Flexibility**: Easy to customize for different data types
- **Reusability**: Write once, use everywhere