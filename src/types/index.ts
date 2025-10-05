// Common type definitions for the application

export type Product = {
  id: string
  name: string
  sku: string
  description: string | null
  price: number
  barcode: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type InventoryLocation = {
  id: string
  name: string
  address: string | null
  contactPerson: string | null
  contactNumber: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type AttributeTemplate = {
  id: string
  label: string
  createdAt: Date
}

export type StockLevel = {
  id: string
  quantity: number
  minThreshold: number | null
  updatedAt: Date
  productId: string
  locationId: string
}

// You can add more types as needed
