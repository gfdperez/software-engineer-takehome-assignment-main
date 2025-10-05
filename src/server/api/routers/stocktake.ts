import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const stocktakeRouter = createTRPCRouter({
  // Get all stocktakes
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.stocktake.findMany({
      orderBy: { startedAt: 'desc' },
      include: {
        location: true,
        items: true,
      },
    })
  }),

  // Get stocktakes by location
  getByLocation: publicProcedure
    .input(z.object({ locationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.stocktake.findMany({
        where: { locationId: input.locationId },
        orderBy: { startedAt: 'desc' },
        include: {
          location: true,
          items: true,
        },
      })
    }),

  // Get single stocktake by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.stocktake.findUnique({
        where: { id: input.id },
        include: {
          location: true,
          items: true,
        },
      })
    }),

  // Create a new stocktake session
  create: publicProcedure
    .input(
      z.object({
        locationId: z.string(),
        countedBy: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get all stock levels for this location
      const stockLevels = await ctx.prisma.stockLevel.findMany({
        where: {
          locationId: input.locationId,
          product: {
            deletedAt: null,
          },
        },
        include: {
          product: true,
        },
      })

      // Create stocktake with items
      return ctx.prisma.stocktake.create({
        data: {
          locationId: input.locationId,
          countedBy: input.countedBy,
          notes: input.notes,
          items: {
            create: stockLevels.map((stock) => ({
              systemQuantity: stock.quantity,
              productSku: stock.product.sku,
              productName: stock.product.name,
            })),
          },
        },
        include: {
          location: true,
          items: true,
        },
      })
    }),

  // Update stocktake item count
  updateItemCount: publicProcedure
    .input(
      z.object({
        itemId: z.string(),
        countedQuantity: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.stocktakeItem.findUnique({
        where: { id: input.itemId },
      })

      if (!item) {
        throw new Error('Stocktake item not found')
      }

      const variance = input.countedQuantity - item.systemQuantity

      return ctx.prisma.stocktakeItem.update({
        where: { id: input.itemId },
        data: {
          countedQuantity: input.countedQuantity,
          variance,
        },
      })
    }),

  // Finalize stocktake and update stock levels
  finalize: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const stocktake = await ctx.prisma.stocktake.findUnique({
        where: { id: input.id },
        include: {
          items: true,
        },
      })

      if (!stocktake) {
        throw new Error('Stocktake not found')
      }

      if (stocktake.completedAt) {
        throw new Error('Stocktake already completed')
      }

      // Update stock levels based on counted quantities
      for (const item of stocktake.items) {
        if (item.countedQuantity !== null) {
          // Find the stock level by product SKU and location
          const product = await ctx.prisma.product.findUnique({
            where: { sku: item.productSku },
          })

          if (product) {
            await ctx.prisma.stockLevel.updateMany({
              where: {
                productId: product.id,
                locationId: stocktake.locationId,
              },
              data: {
                quantity: item.countedQuantity,
              },
            })
          }
        }
      }

      // Mark stocktake as completed
      return ctx.prisma.stocktake.update({
        where: { id: input.id },
        data: {
          completedAt: new Date(),
        },
        include: {
          location: true,
          items: true,
        },
      })
    }),

  // Delete a stocktake
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.stocktake.delete({
        where: { id: input.id },
      })
    }),
})
