import Head from 'next/head'
import Link from 'next/link'

export default function StocktakesPage() {
  return (
    <>
      <Head>
        <title>Stocktakes - Inventory Management</title>
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">← Back to Home</Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Stocktakes</h1>

        <p style={{ color: '#666', marginBottom: '2rem' }}>
          TODO: Build the stocktake page with:
        </p>

        <ul style={{ lineHeight: '2', color: '#666' }}>
          <li>Create new stocktake session for a location</li>
          <li>List all products in the selected location</li>
          <li>Count interface with system quantity vs counted quantity</li>
          <li>Visual indicators for variances (red/green)</li>
          <li>Confirmation modal before finalizing with variance summary</li>
          <li>Update stock levels upon confirmation</li>
          <li>List of past stocktakes with details</li>
        </ul>
      </main>
    </>
  )
}
