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
      return ctx.prisma.product.create({
        data: input,
      })
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
