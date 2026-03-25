import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast, type ToastType } from '../components/ui/Toast';

interface ToastOptions {
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType; options?: ToastOptions }[]>([]);

  const addToast = useCallback((message: string, type: ToastType, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, options }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Contenedor flotante de Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto flex justify-end">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              options={toast.options}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
};
