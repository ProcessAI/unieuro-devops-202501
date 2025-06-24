import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

type ToastOptions = { duration?: number };
type ToastContextType = {
  showToast: (content: React.ReactNode, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);
let idCounter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    id: number;
    content: React.ReactNode;
    duration: number;
  } | null>(null);

  const showToast = useCallback(
    (content: React.ReactNode, options?: ToastOptions) => {
      const id = ++idCounter;
      setToast({
        id,
        content,
        duration: options?.duration ?? 5000,
      });
    },
    [toast]
  );

  useEffect(() => {
    if (!toast) return;
    if (toast.duration === Infinity) return;
    const timer = setTimeout(() => setToast(null), toast.duration);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed inset-x-0 top-5 flex justify-center z-50 pointer-events-none">
          <div className="relative bg-yellow-400 text-black px-4 py-3 rounded-lg shadow-lg flex items-center space-x-4 pointer-events-auto">
            {toast.content}
            <button
              onClick={() => setToast(null)}
              className="absolute top-1 right-1 text-black hover:text-gray-400 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast só pode ser usado dentro de ToastProvider');
  return ctx;
};
