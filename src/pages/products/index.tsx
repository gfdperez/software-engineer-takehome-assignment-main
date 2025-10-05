import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '@/utils/trpc'
import TableComponent from '@/components/TableComponent'

export default function ProductsPage() {
  const { data: products, isLoading } = trpc.product.getAll.useQuery({ limit: 20, cursor: "cmgd9onzp0012f9706ajsnge5" })
  console.log(products)
  return (
    <>
      <Head>
        <title>Products - Inventory Management</title>
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">← Back to Home</Link>
        </div>

        <h1 className='font-sans'>Products</h1>

        {!isLoading && <TableComponent data={products?.products || []} />}
      </main>
    </>
  )
}


/* 
  TODO: 
    <li>Data table with pagination</li>
    <li>Search and filter functionality</li>
    <li>Create/Edit product modal/dialog</li>
    <li>Product detail view showing stock across locations</li>
    <li>Delete confirmation</li>
*/