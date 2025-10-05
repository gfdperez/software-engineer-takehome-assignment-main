import Head from 'next/head'
import Link from 'next/link'

export default function LocationsPage() {
  return (
    <>
      <Head>
        <title>Locations - Inventory Management</title>
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">← Back to Home</Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          Inventory Locations
        </h1>

        <p style={{ color: '#666', marginBottom: '2rem' }}>
          TODO: Build the inventory locations page with:
        </p>

        <ul style={{ lineHeight: '2', color: '#666' }}>
          <li>Data table of all locations</li>
          <li>Show total products stocked per location</li>
          <li>Show total stock value per location</li>
          <li>Create/Edit location modal/dialog</li>
          <li>View stock levels for each location</li>
        </ul>
      </main>
    </>
  )
}
