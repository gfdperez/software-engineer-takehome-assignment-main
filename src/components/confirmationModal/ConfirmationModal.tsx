import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { 
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';

export type ConfirmationType = 'warning' | 'error' | 'info' | 'success';
export type ActionType = 'delete' | 'add' | 'edit' | 'save' | 'custom';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  type?: ConfirmationType;
  actionType?: ActionType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  itemName?: string;
  customIcon?: React.ReactNode;
}

const getTypeConfig = (type: ConfirmationType) => {
  switch (type) {
    case 'error':
      return {
        color: 'error.main',
        icon: <ErrorIcon />
      };
    case 'warning':
      return {
        color: 'warning.main',
        icon: <WarningIcon />
      };
    case 'success':
      return {
        color: 'success.main',
        icon: <SuccessIcon />
      };
    case 'info':
    default:
      return {
        color: 'info.main',
        icon: <InfoIcon />
      };
  }
};

const getActionConfig = (actionType: ActionType) => {
  switch (actionType) {
    case 'delete':
      return {
        icon: <DeleteIcon />,
        defaultTitle: 'Confirm Deletion',
        defaultMessage: 'Are you sure you want to delete this item?',
        defaultConfirmText: 'Delete',
        type: 'error' as ConfirmationType
      };
    case 'add':
      return {
        icon: <AddIcon />,
        defaultTitle: 'Confirm Addition',
        defaultMessage: 'Are you sure you want to add this item?',
        defaultConfirmText: 'Add',
        type: 'success' as ConfirmationType
      };
    case 'edit':
      return {
        icon: <EditIcon />,
        defaultTitle: 'Confirm Changes',
        defaultMessage: 'Are you sure you want to save these changes?',
        defaultConfirmText: 'Save Changes',
        type: 'warning' as ConfirmationType
      };
    case 'save':
      return {
        icon: <SuccessIcon />,
        defaultTitle: 'Save Changes',
        defaultMessage: 'Are you sure you want to save your changes?',
        defaultConfirmText: 'Save',
        type: 'success' as ConfirmationType
      };
    case 'custom':
    default:
      return {
        icon: <InfoIcon />,
        defaultTitle: 'Confirm Action',
        defaultMessage: 'Are you sure you want to proceed?',
        defaultConfirmText: 'Confirm',
        type: 'info' as ConfirmationType
      };
  }
};

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type,
  actionType = 'custom',
  confirmText,
  cancelText = 'Cancel',
  isLoading = false,
  itemName,
  customIcon
}: ConfirmationModalProps) {
  const actionConfig = getActionConfig(actionType);
  const finalType = type || actionConfig.type;
  const typeConfig = getTypeConfig(finalType);
  
  const finalTitle = title || actionConfig.defaultTitle;
  const finalMessage = message || actionConfig.defaultMessage;
  const finalConfirmText = confirmText || actionConfig.defaultConfirmText;
  const finalIcon = customIcon || actionConfig.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in confirmation action:', error);
    }
  };

  // Customize message based on itemName
  const getContextualMessage = () => {
    if (itemName) {
      switch (actionType) {
        case 'delete':
          return `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;
        case 'add':
          return `Are you sure you want to add "${itemName}"?`;
        case 'edit':
          return `Are you sure you want to save changes to "${itemName}"?`;
        default:
          return finalMessage;
      }
    }
    return finalMessage;
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isLoading ? onClose : undefined}
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          padding: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              color: typeConfig.color,
            }}
          >
            {finalIcon}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {finalTitle}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body1" color="text.secondary">
          {getContextualMessage()}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          variant="outlined"
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          color={finalType === 'error' ? 'error' : 'primary'}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
          sx={{ ml: 1 }}
        >
          {isLoading ? 'Processing...' : finalConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}