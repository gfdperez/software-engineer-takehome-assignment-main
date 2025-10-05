import { createTRPCRouter } from '@/server/api/trpc'
import { productRouter } from '@/server/api/routers/product'
import { locationRouter } from '@/server/api/routers/location'
import { stocktakeRouter } from '@/server/api/routers/stocktake'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  location: locationRouter,
  stocktake: stocktakeRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
