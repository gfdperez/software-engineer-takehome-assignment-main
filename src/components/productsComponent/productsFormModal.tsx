import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material'
import { trpc } from '@/utils/trpc'
import { createProductSchema, type CreateProductInput } from '@/schemas/productSchema'

interface ProductsFormModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ProductsFormModal({ 
  open, 
  onClose, 
  onSuccess 
}: ProductsFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Use the shared schema with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
  })

  // tRPC mutation
  const createProductMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      reset()
      onSuccess?.()
      onClose()
      setIsSubmitting(false)
    },
    onError: (error) => {
      console.error('Error creating product:', error)
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: CreateProductInput) => {
    setIsSubmitting(true)
    createProductMutation.mutate(data)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          p: '16px 8px',
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle sx={{fontWeight: 'bold', fontSize: '1.5rem'}}>Add New Product</DialogTitle>
      <DialogContent>
        <Box component="form">
          <TextField
            {...register('name')}
            label="Product Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          
          <TextField
            {...register('sku')}
            label="SKU"
            fullWidth
            margin="normal"
            error={!!errors.sku}
            helperText={errors.sku?.message}
          />
          
          <TextField
            {...register('description')}
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          
          <TextField
            {...register('price', { valueAsNumber: true })}
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            slotProps={{
              htmlInput: {
                step: '0.01',
                min: '0'
              }
            }}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          
          <TextField
            {...register('barcode')}
            label="Barcode (Optional)"
            fullWidth
            margin="normal"
            error={!!errors.barcode}
            helperText={errors.barcode?.message}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}