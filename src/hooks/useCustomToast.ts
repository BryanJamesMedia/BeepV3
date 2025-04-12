import { useCallback } from 'react';

// Type definition for toast params
type ToastParams = {
  title: string;
  status?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
};

// Default toast implementation that doesn't rely on Chakra UI
export const useCustomToast = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toast = useCallback(({ title, status = 'info', duration = 3000 }: ToastParams) => {
    // Create a simple toast notification with CSS
    const toastElement = document.createElement('div');
    toastElement.textContent = title;
    toastElement.style.position = 'fixed';
    toastElement.style.bottom = '20px';
    toastElement.style.right = '20px';
    toastElement.style.padding = '12px 20px';
    toastElement.style.borderRadius = '4px';
    toastElement.style.fontWeight = 'bold';
    toastElement.style.zIndex = '9999';
    
    // Set background color based on status
    switch (status) {
      case 'success':
        toastElement.style.backgroundColor = '#48BB78';
        break;
      case 'error':
        toastElement.style.backgroundColor = '#F56565';
        break;
      case 'warning':
        toastElement.style.backgroundColor = '#ECC94B';
        break;
      case 'info':
      default:
        toastElement.style.backgroundColor = '#4299E1';
        break;
    }
    
    toastElement.style.color = 'white';
    toastElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Add to document
    document.body.appendChild(toastElement);
    
    // Remove after duration
    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement);
      }
    }, duration);
  }, []);
  
  return toast;
};

export default useCustomToast; 