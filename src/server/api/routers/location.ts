import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const locationRouter = createTRPCRouter({
  // Get all locations (excluding soft-deleted)
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.inventoryLocation.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        stockLevels: {
          include: {
            product: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    })
  }),

  // Get single location by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.inventoryLocation.findFirst({
        where: {
          id: input.id,
          deletedAt: null,
        },
        include: {
          stockLevels: {
            include: {
              product: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      })
    }),

  // Create a new location
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        address: z.string().optional(),
        contactPerson: z.string().optional(),
        contactNumber: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.inventoryLocation.create({
        data: input,
      })
    }),

  // Update a location
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        address: z.string().optional(),
        contactPerson: z.string().optional(),
        contactNumber: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...locationData } = input

      return ctx.prisma.inventoryLocation.update({
        where: { id },
        data: locationData,
      })
    }),

  // Soft delete a location
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.inventoryLocation.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      })
    }),
})
