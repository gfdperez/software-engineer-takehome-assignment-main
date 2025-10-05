import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import TableComponent from '@/components/TableComponent'
import { Button, FormControl, InputLabel, MenuItem, NativeSelect, Select } from '@mui/material'
import { dataTagErrorSymbol } from '@tanstack/react-query'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(3)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [prevCursors, setPrevCursors] = useState<string[]>([])

  console.log('Search:', search)
  console.log('Limit:', limit)
  console.log('Cursor:', cursor)
  console.log('PrevCursors:', prevCursors)
  // tRPC query automatically refetches when search, limit, or cursor changes
  const { data: products, isLoading } = trpc.product.getAll.useQuery({ 
    limit, 
    cursor,
    search: search.trim() || undefined 
  })

  const handleNextPage = () => {
    if (products?.nextCursor) {
      setPrevCursors((previousCursors) => cursor ? [...previousCursors, cursor] : previousCursors) // Store previous cursor
      setCursor(products.nextCursor)
    }
  }

  const handlePrevPage = () => {
    const prevCursor = prevCursors.pop() // Get last cursor
    setCursor(prevCursor)
  }

  const handleSelectLimit = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLimit(event.target.value as number)
    setCursor(undefined) // Reset cursor when limit changes
  }
  
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

        {isLoading && <div>Loading...</div>}
        {!isLoading && <TableComponent data={products?.products || []} />}

        <FormControl>
          <InputLabel id="demo-simple-select-label">Rows</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={3}
            value={limit}
            label="Rows per page"
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <MenuItem value={3}>3 per page</MenuItem>
            <MenuItem value={8}>8 per page</MenuItem>
            <MenuItem value={10}>10 per page</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={handlePrevPage}>Prev</Button>
        <Button variant="contained" onClick={handleNextPage}>Next</Button>

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