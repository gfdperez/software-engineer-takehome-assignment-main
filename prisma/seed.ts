import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create inventory locations using upsert to avoid duplicates
  const warehouse1 = await prisma.inventoryLocation.upsert({
    where: { name: 'Main Warehouse' },
    update: {},
    create: {
      name: 'Main Warehouse',
      address: '123 Industrial Ave, City, State 12345',
      contactPerson: 'John Doe',
      contactNumber: '+1-555-0100',
    },
  })

  const warehouse2 = await prisma.inventoryLocation.upsert({
    where: { name: 'Retail Store Downtown' },
    update: {},
    create: {
      name: 'Retail Store Downtown',
      address: '456 Main St, City, State 12345',
      contactPerson: 'Jane Smith',
      contactNumber: '+1-555-0200',
    },
  })

  const warehouse3 = await prisma.inventoryLocation.upsert({
    where: { name: 'Distribution Center North' },
    update: {},
    create: {
      name: 'Distribution Center North',
      address: '789 Commerce Blvd, City, State 12345',
      contactPerson: 'Bob Johnson',
      contactNumber: '+1-555-0300',
    },
  })

  console.log('✅ Created inventory locations')

  // Create products
  const products = [
    {
      name: 'Classic T-Shirt',
      sku: 'TSHIRT-001',
      description: 'Comfortable cotton t-shirt',
      price: 19.99,
      barcode: '1234567890123',
    },
    {
      name: 'Denim Jeans',
      sku: 'JEANS-001',
      description: 'Classic blue denim jeans',
      price: 49.99,
      barcode: '1234567890124',
    },
    {
      name: 'Leather Jacket',
      sku: 'JACKET-001',
      description: 'Premium leather jacket',
      price: 199.99,
      barcode: '1234567890125',
    },
    {
      name: 'Running Shoes',
      sku: 'SHOES-001',
      description: 'Lightweight running shoes',
      price: 89.99,
      barcode: '1234567890126',
    },
    {
      name: 'Wool Sweater',
      sku: 'SWEATER-001',
      description: 'Warm wool sweater',
      price: 59.99,
      barcode: '1234567890127',
    },
    {
      name: 'Canvas Backpack',
      sku: 'BACKPACK-001',
      description: 'Durable canvas backpack',
      price: 39.99,
      barcode: '1234567890128',
    },
    {
      name: 'Baseball Cap',
      sku: 'CAP-001',
      description: 'Adjustable baseball cap',
      price: 14.99,
      barcode: '1234567890129',
    },
    {
      name: 'Wool Socks',
      sku: 'SOCKS-001',
      description: 'Comfortable wool socks',
      price: 9.99,
      barcode: '1234567890130',
    },
    {
      name: 'Leather Belt',
      sku: 'BELT-001',
      description: 'Genuine leather belt',
      price: 29.99,
      barcode: '1234567890131',
    },
    {
      name: 'Sports Watch',
      sku: 'WATCH-001',
      description: 'Water-resistant sports watch',
      price: 129.99,
      barcode: '1234567890132',
    },
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    })

    // Add stock levels for each location using upsert
    await prisma.stockLevel.upsert({
      where: {
        productId_locationId: {
          productId: product.id,
          locationId: warehouse1.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        locationId: warehouse1.id,
        quantity: Math.floor(Math.random() * 100) + 20, // Random quantity 20-120
        minThreshold: 10,
      },
    })

    await prisma.stockLevel.upsert({
      where: {
        productId_locationId: {
          productId: product.id,
          locationId: warehouse2.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        locationId: warehouse2.id,
        quantity: Math.floor(Math.random() * 50) + 10, // Random quantity 10-60
        minThreshold: 5,
      },
    })

    await prisma.stockLevel.upsert({
      where: {
        productId_locationId: {
          productId: product.id,
          locationId: warehouse3.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        locationId: warehouse3.id,
        quantity: Math.floor(Math.random() * 80) + 15, // Random quantity 15-95
        minThreshold: 8,
      },
    })
  }

  console.log('✅ Created products with stock levels')
  console.log('🎉 Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
