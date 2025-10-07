import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import GenericTable from '@/components/genericTable/GenericTable'
import TableSkeletonLoader from '@/components/skeletonLoader/TableSkeletonLoader'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { Product } from '@/types'
import ProductsFormModal from '@/components/products/ProductFormModal'
import { productTableHeaders, renderProductCell } from '@/config/TableConfigs'
import ProductViewModal from '@/components/products/ProductViewModal'
import ConfirmationModal from '@/components/confirmationModal/ConfirmationModal'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(3)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [prevCursors, setPrevCursors] = useState<string[]>([])
  const [dirtySearch, setDirtySearch] = useState('')
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const confirmation = useConfirmationModal()
  const { data: products, isLoading } = trpc.product.getAll.useQuery({ 
    limit, 
    cursor,
    search: search.trim() || undefined 
  })

  // Delete mutation
  const deleteProductMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      handleRefreshProducts()
    },
    onError: (error) => {
      console.error('Error deleting product:', error)
    }
  })

  const handleRefreshProducts = () => {
    utils.product.getAll.invalidate()
    setCursor(undefined)
    setPrevCursors([])
  }

  const handleNextPage = () => {
    if (products?.nextCursor) {
      setPrevCursors((previousCursors) => cursor ? [...previousCursors, cursor] : previousCursors)
      setCursor(products.nextCursor)
    }
  }

  const handlePrevPage = () => {
    const prevCursor = prevCursors.pop()
    setCursor(prevCursor)
  }

  const handleRowClick = (product: Product) => {
    setSelectedProductId(product.id)
    setOpenViewModal(true)
  }

  const handleCloseViewModal = () => {
    setOpenViewModal(false)
    setSelectedProductId(null)
  }

  const handleRowEdit = (product: Product) => {
    setOpenEditModal(true);
    setSelectedProductId(product.id);
  }

  const handleRowDelete = (product: Product) => {
    confirmation.openConfirmation(
      async () => {
        await deleteProductMutation.mutateAsync({ id: product.id })
      },
      {
        actionType: 'delete',
        itemName: product.name
      }
    );
  }

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
          (<TableSkeletonLoader columns={6} />) :
          (<>
            <GenericTable 
              data={products?.products || []} 
              headers={productTableHeaders}
              editable={true}
              defaultOrderBy="createdAt"
              defaultOrder="desc"
              renderCell={(item, key) => renderProductCell(item as Product, key as keyof Product)}
              onRowClick={(item) => handleRowClick(item as Product)}
              onRowEdit={(item) => handleRowEdit(item as Product)}
              onRowDelete={(item) => handleRowDelete(item as Product)}
            />
            <div className='flex items-center gap-2 mt-4 justify-end'>
              <FormControl size='small'>
                <InputLabel id="demo-simple-select-label">Rows</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={3}
                  value={limit}
                  label="Rows per page"
                  onChange={(e) => (setLimit(Number(e.target.value)), setCursor(undefined))}
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

        {openViewModal && selectedProductId && (
          <ProductViewModal 
            productId={selectedProductId} 
            open={openViewModal} 
            onClose={handleCloseViewModal} 
          />
        )}

        {openCreateModal && (
          <ProductsFormModal 
            open={openCreateModal} 
            onClose={() => setOpenCreateModal(false)} 
            onRefresh={handleRefreshProducts}
          />
        )}

        {openEditModal && selectedProductId && (
          <ProductsFormModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            onRefresh={handleRefreshProducts}
            product={products?.products.find(p => p.id === selectedProductId) || null}
            mode="edit"
          />
        )}

        <ConfirmationModal
          open={confirmation.isOpen}
          onClose={confirmation.closeConfirmation}
          onConfirm={confirmation.handleConfirm}
          isLoading={confirmation.isLoading}
          {...confirmation.config}
        />
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