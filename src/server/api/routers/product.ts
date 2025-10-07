import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { 
  createProductSchema, 
  updateProductSchema, 
  getProductByIdSchema, 
  getProductsSchema 
} from '@/schemas/productSchema'
import { checkForDuplicates } from '@/server/utils/productApiUtils'

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
      const duplicateResult = await checkForDuplicates(
      ctx.prisma,
      ctx.prisma.product,
      [
        {
          field: 'sku',
          value: input.sku,
          required: true,
          errorMessage: `A product with SKU "${input.sku}" already exists`,
          errorType: 'DUPLICATE_SKU',
        },
        {
          field: 'barcode',
          value: input.barcode,
          required: false,
          errorMessage: `A product with barcode "${input.barcode}" already exists`,
          errorType: 'DUPLICATE_BARCODE',
        },
        {
          field: 'name',
          value: input.name,
          required: true,
          errorMessage: `A product with the same name "${input.name}" already exists`,
          errorType: 'DUPLICATE_PRODUCT',
        },
      ]
    );

    // Return early if duplicates found
    if (!duplicateResult.success) {
      return {
        success: false,
        error: duplicateResult.error,
        errorType: duplicateResult.errorType,
        data: null,
      };
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

      
    // Check for duplicates, excluding the current product
    const duplicateResult = await checkForDuplicates(
      ctx.prisma,
      ctx.prisma.product,
      [
        {
          field: 'sku',
          value: productData.sku,
          required: true,
          errorMessage: `A product with SKU "${productData.sku}" already exists`,
          errorType: 'DUPLICATE_SKU',
          excludeId: id, // Exclude current product from check
        },
        {
          field: 'barcode',
          value: productData.barcode,
          required: false,
          errorMessage: `A product with barcode "${productData.barcode}" already exists`,
          errorType: 'DUPLICATE_BARCODE',
          excludeId: id,
        },
        {
          field: 'name',
          value: productData.name,
          required: true,
          errorMessage: `A product with the same name "${productData.name}" already exists`,
          errorType: 'DUPLICATE_PRODUCT',
          excludeId: id,
        },
      ]
    );

    // Return early if duplicates found
    if (!duplicateResult.success) {
      return {
        success: false,
        error: duplicateResult.error,
        errorType: duplicateResult.errorType,
        data: null,
      };
    }

    try {
      const product = await ctx.prisma.product.update({
        where: { id },
        data: productData,
      });

      return {
        success: true,
        error: null,
        errorType: null,
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update product. Please try again.',
        errorType: 'DATABASE_ERROR' as const,
        data: null,
      };
    }
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
