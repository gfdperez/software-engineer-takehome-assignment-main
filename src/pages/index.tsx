import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '@/utils/trpc'

export default function Home() {
  // Example: Fetch products using tRPC
  const { data, isLoading, error } = trpc.product.getAll.useQuery({
    limit: 5,
  })

  return (
    <>
      <Head>
        <title>Inventory Management System</title>
        <meta name="description" content="Inventory Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          Inventory Management System
        </h1>

        <nav style={{ marginBottom: '2rem' }}>
          <Link href="/products" style={{ marginRight: '1rem' }}>
            Products
          </Link>
          <Link href="/locations" style={{ marginRight: '1rem' }}>
            Locations
          </Link>
          <Link href="/stocktakes">Stocktakes</Link>
        </nav>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Recent Products
          </h2>

          {isLoading && <p>Loading products...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

          {data?.products && data.products.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              }}
            >
              {data.products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '1rem',
                    borderRadius: '8px',
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.875rem' }}>
                    SKU: {product.sku}
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    ${product.price.toFixed(2)}
                  </p>
                  {product.description && (
                    <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                      {product.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !isLoading && <p>No products found.</p>
          )}
        </section>

        <section style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            🚀 Getting Started
          </h2>
          <ol style={{ lineHeight: '2' }}>
            <li>
              Check out <code>src/server/api/routers/</code> for tRPC routers (product, location, stocktake)
            </li>
            <li>
              This page demonstrates fetching data using{' '}
              <code>trpc.product.getAll.useQuery()</code>
            </li>
            <li>
              Build out the Products, Locations, and Stocktakes pages in{' '}
              <code>src/pages/</code>
            </li>
            <li>
              Create reusable components in <code>src/components/</code>
            </li>
            <li>
              Database schema is in <code>prisma/schema.prisma</code>
            </li>
            <li>
              Run <code>npx prisma generate && npx prisma db push</code> to set up the database
            </li>
          </ol>
        </section>
      </main>
    </>
  )
}
