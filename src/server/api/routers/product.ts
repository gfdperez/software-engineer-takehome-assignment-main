import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { 
  createProductSchema, 
  updateProductSchema, 
  getProductByIdSchema, 
  getProductsSchema 
} from '@/schemas/productSchema'

export const productRouter = createTRPCRouter({
  // Get all products (excluding soft-deleted)
  getAll: publicProcedure
    .input(getProductsSchema)
    .query(async ({ ctx, input }) => {
      const { search, limit, cursor } = input

      const products = await ctx.prisma.product.findMany({
        where: {
          deletedAt: null, // Filter out soft-deleted products
          ...(search && {
            OR: [
              { name: { contains: search } },
              { sku: { contains: search } },
            ],
          }),
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          stockLevels: {
            include: {
              location: true,
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (products.length > limit) {
        const nextItem = products.pop()
        nextCursor = nextItem?.id
      }

      return {
        products,
        nextCursor,
      }
    }),

  // Get single product by ID
  getById: publicProcedure
    .input(getProductByIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findFirst({
        where: {
          id: input.id,
          deletedAt: null,
        },
        include: {
          stockLevels: {
            where: {
              location: {
                deletedAt: null,
              },
            },
            include: {
              location: true,
            },
          },
        },
      })
    }),

  // Create a new product
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const duplicateChecks = await Promise.all([
        // Check SKU duplication
        ctx.prisma.product.findFirst({
          where: {
            sku: input.sku,
            deletedAt: null,
          },
        }),
        // Check barcode duplication (if provided)
        input.barcode ? ctx.prisma.product.findFirst({
          where: {
            barcode: input.barcode,
            deletedAt: null,
          },
        }) : null,
        // Check exact name (optional business rule)
        ctx.prisma.product.findFirst({
          where: {
            name: input.name,
            deletedAt: null,
          },
        }),
      ])

      const [existingSku, existingBarcode, existingName] = duplicateChecks

      // Handle different duplication scenarios by returning error objects
      if (existingSku) {
        return {
          success: false,
          error: `A product with SKU "${input.sku}" already exists`,
          errorType: 'DUPLICATE_SKU' as const,
          data: null,
        }
      }

      if (existingBarcode && input.barcode) {
        return {
          success: false,
          error: `A product with barcode "${input.barcode}" already exists`,
          errorType: 'DUPLICATE_BARCODE' as const,
          data: null,
        }
      }

      if (existingName) {
        return {
          success: false,
          error: `A product with the same name "${input.name}" already exists`,
          errorType: 'DUPLICATE_PRODUCT' as const,
          data: null,
        }
      }
      
      try {
        const product = await ctx.prisma.product.create({
          data: input,
        })
        
        return {
          success: true,
          error: null,
          errorType: null,
          data: product,
        }
      } catch (error) {
        return {
          success: false,
          error: 'Failed to create product. Please try again.',
          errorType: 'DATABASE_ERROR' as const,
          data: null,
        }
      }
    }),

  // Update a product
  update: publicProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...productData } = input

      return ctx.prisma.product.update({
        where: { id },
        data: productData,
      })
    }),

  // Soft delete a product
  delete: publicProcedure
    .input(getProductByIdSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      })
    }),
})
