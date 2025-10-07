import { useState } from 'react';
import { ActionType, ConfirmationType } from '@/components/confirmationModal/ConfirmationModal';

interface UseConfirmationModalOptions {
  title?: string;
  message?: string;
  type?: ConfirmationType;
  actionType?: ActionType;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
}

export function useConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<UseConfirmationModalOptions>({});
  const [confirmAction, setConfirmAction] = useState<(() => void | Promise<void>) | null>(null);

  const openConfirmation = (
    action: () => void | Promise<void>,
    options: UseConfirmationModalOptions = {}
  ) => {
    setConfig(options);
    setConfirmAction(() => action);
    setIsOpen(true);
  };

  const closeConfirmation = () => {
    if (!isLoading) {
      setIsOpen(false);
      setConfirmAction(null);
      setConfig({});
    }
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      setIsLoading(true);
      try {
        await confirmAction();
        closeConfirmation();
      } catch (error) {
        console.error('Error in confirmation action:', error);
        // Keep modal open on error so user can try again or cancel
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    isOpen,
    isLoading,
    config,
    openConfirmation,
    closeConfirmation,
    handleConfirm
  };
}