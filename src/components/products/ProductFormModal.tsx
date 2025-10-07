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
  useMediaQuery,
  useTheme,
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
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
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
      maxWidth={false}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: { xs: '95vw', sm: '90vw', md: '600px', lg: '700px' },
          maxWidth: { xs: '95vw', sm: '90vw', md: '600px', lg: '700px' },
          height: { xs: 'auto', sm: 'auto', md: 'auto' },
          maxHeight: { xs: '90vh', sm: '85vh', md: '80vh' },
          margin: { xs: '16px', sm: '24px', md: '32px' },
          padding: { xs: '16px 8px', sm: '20px 12px', md: '24px 16px' },
          borderRadius: { xs: '12px', md: '16px' },
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{
          fontWeight: 'bold', 
          fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
          padding: { xs: '6px', sm: '10px', md: '16px' },
          paddingBottom: { xs: '4px', sm: '8px', md: '12px' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
        {inputError && (
          <Alert 
            severity="error" 
            sx={{ 
              mx: { xs: 1, sm: 2, md: 3 },
              my: { xs: 1, sm: 1, md: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {inputError}
          </Alert>
        )}
      <DialogContent
        sx={{
          padding: { xs: '8px 16px', sm: '10px 20px', md: '12px 24px' },
          overflowY: 'auto',
          '& .MuiTextField-root': {
            '& .MuiInputLabel-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            },
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '12px 14px', sm: '16.5px 14px' }
            },
            '& .MuiFormHelperText-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }
          }
        }}
      >
        <Box 
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 2.5, md: 3 }
          }}
        >
          <TextField
            {...register('name')}
            label="Product Name"
            fullWidth
            margin="none"
            size={isMobile ? 'small' : 'medium'}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          />
          
          <TextField
            {...register('sku')}
            label="SKU"
            fullWidth
            margin="none"
            size={isMobile ? 'small' : 'medium'}
            error={!!errors.sku}
            helperText={errors.sku?.message}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 2 } }}>
            <TextField
              {...register('price', { valueAsNumber: true })}
              label="Price"
              type="number"
              fullWidth
              margin="none"
              size={isMobile ? 'small' : 'medium'}
              slotProps={{
                htmlInput: {
                  step: '0.01',
                  min: '0'
                }
              }}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            
            <TextField
              {...register('barcode')}
              label="Barcode (Optional)"
              fullWidth
              margin="none"
              size={isMobile ? 'small' : 'medium'}
              error={!!errors.barcode}
              helperText={errors.barcode?.message}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
          </Box>
          
          <TextField
            {...register('description')}
            label="Description (Optional)"
            fullWidth
            margin="none"
            multiline
            rows={3}
            size={isMobile ? 'small' : 'medium'}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minHeight: { xs: '60px', sm: '80px' }
              }
            }}
          />
          
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: { xs: '6px', sm: '10px', md: '16px' },
          paddingTop: { xs: '4px', sm: '8px', md: '12px' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 1 },
          '& .MuiButton-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '8px 16px', sm: '10px 22px' },
            minHeight: { xs: '36px', sm: '42px' },
            width: { xs: '100%', sm: 'auto' }
          }
        }}
      >
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
          sx={{
            order: { xs: 2, sm: 1 }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            order: { xs: 1, sm: 2 }
          }}
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