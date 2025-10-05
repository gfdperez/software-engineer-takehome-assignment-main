import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const productRouter = createTRPCRouter({
  // Get all products (excluding soft-deleted)
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
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
    .input(z.object({ id: z.string() }))
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
    .input(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        barcode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.create({
        data: input,
      })
    }),

  // Update a product
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        sku: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        barcode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...productData } = input

      return ctx.prisma.product.update({
        where: { id },
        data: productData,
      })
    }),

  // Soft delete a product
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      })
    }),
})
