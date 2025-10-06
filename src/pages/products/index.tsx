import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import TableComponent from '@/components/TableComponent'
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Skeleton } from '@mui/material'
import TableSkeletonLoader from '@/components/TableSkeletonLoader'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ProductsFormModal from '@/components/productsComponent/productsFormModal'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(3)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [prevCursors, setPrevCursors] = useState<string[]>([])
  const [dirtySearch, setDirtySearch] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)

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

        <div className='flex flex-col items-center sm:flex-row sm:justify-between'>
          <h1 className='font-sans text-4xl font-bold sm:mb-8'>Products</h1>
          <Button variant="text" startIcon={<AddCircleIcon />} sx={{ mb: 2 }} onClick={() => setOpenCreateModal(true)}>
            Add Product
          </Button>
        </div>

        <form noValidate autoComplete="off" className='flex flex-col gap-2 sm:flex-row sm:items-center mb-4'>
          <FormControl size='small' sx={{ width: "100%" }}>
            <OutlinedInput placeholder="Search Product (Name or SKU)" name='search' value={dirtySearch} onChange={(e) => setDirtySearch(e.target.value)} />
          </FormControl>
          <Button variant="outlined" onClick={() => setSearch(dirtySearch !== '' ? dirtySearch : '')}>Search</Button>
        </form>


        {isLoading ? 
          (<TableSkeletonLoader columns={5} />) :
          (<>
            <TableComponent data={products?.products || []} />
            <div className='flex items-center gap-2 mt-4 justify-end'>
              <FormControl size='small'>
                <InputLabel id="demo-simple-select-label">Rows</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={3}
                  value={limit}
                  label="Rows per page"
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </Select>
              </FormControl>

              <Button variant="outlined" onClick={handlePrevPage}>Prev</Button>
              <Button variant="contained" onClick={handleNextPage}>Next</Button>
            </div>
          </>)
        }

        {openCreateModal && (
          <ProductsFormModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
        )}
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