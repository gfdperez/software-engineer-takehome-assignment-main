import Head from 'next/head'
import Link from 'next/link'

export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>Products - Inventory Management</title>
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">← Back to Home</Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Products</h1>

        <p style={{ color: '#666', marginBottom: '2rem' }}>
          TODO: Build the product list page with:
        </p>

        <ul style={{ lineHeight: '2', color: '#666' }}>
          <li>Data table with pagination</li>
          <li>Search and filter functionality</li>
          <li>Create/Edit product modal/dialog</li>
          <li>Product detail view showing stock across locations</li>
          <li>Delete confirmation</li>
        </ul>
      </main>
    </>
  )
}
