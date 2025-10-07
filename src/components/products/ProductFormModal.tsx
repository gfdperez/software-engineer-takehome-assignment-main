import { useEffect, useState } from 'react'
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
  Alert,
} from '@mui/material'
import { trpc } from '@/utils/trpc'
import { createProductSchema, type CreateProductInput } from '@/schemas/productSchema'
import { Product } from '@/types'

type ProductsFormModalProps = {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  onRefresh?: () => void
  product?: Product | null // For editing mode
  mode?: 'create' | 'edit'
}

type HandleSuccessResult = { 
  success: boolean;
  error: string | null;
  errorType: string | null;
  data: Product | null;
}

export default function ProductsFormModal({ 
  open, 
  onClose, 
  onSuccess,
  onRefresh,
  product,
  mode = 'create'
}: ProductsFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputError, setInputError] = useState<string | null>(null);
  const isEditMode = mode === 'edit' && product
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: isEditMode ? {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      price: product.price,
      barcode: product.barcode || '',
    } : {
      name: '',
      sku: '',
      description: '',
      price: 0,
      barcode: '',
    },
  })

  const handleSuccess = (result: HandleSuccessResult) => {
    if (result.success) {
      reset()
      onSuccess?.()
      onRefresh?.()
      onClose()
      setIsSubmitting(false)
    } else {
      setInputError(result.error || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  const createProductMutation = trpc.product.create.useMutation({
    onSuccess: (result) => {
      handleSuccess(result)
    },
    onError: (error) => {
      setInputError(error.message);
      console.error('Unexpected error creating product:', error)
      setIsSubmitting(false)
    },
  })

  const updateProductMutation = trpc.product.update.useMutation({
      onSuccess: (result) => {
      handleSuccess(result)
    },
      onError: (error) => {
        console.error('Error updating product:', error)
        setIsSubmitting(false)
      },
    })

  const onSubmit = (data: CreateProductInput) => {
    setInputError(null);
    setIsSubmitting(true)
    if (isEditMode) {
      updateProductMutation.mutate({ id: product.id, ...data })
    } else {
      createProductMutation.mutate(data)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // Reset form when product changes or modal opens
  useEffect(() => {
    if (open) {
      if (isEditMode && product) {
        reset({
          name: product.name,
          sku: product.sku,
          description: product.description || '',
          price: product.price,
          barcode: product.barcode || '',
        })
      } else {
        reset({
          name: '',
          sku: '',
          description: '',
          price: 0,
          barcode: '',
        })
      }
    }
  }, [open, product, isEditMode, reset])

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
      <DialogTitle sx={{fontWeight: 'bold', fontSize: '1.5rem'}}>
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
        {inputError && (<Alert severity="error" sx={{ mx: 2 }}>{inputError}</Alert>)}
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
          {isSubmitting 
            ? (isEditMode ? 'Updating...' : 'Adding...') 
            : (isEditMode ? 'Update Product' : 'Add Product')
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
}