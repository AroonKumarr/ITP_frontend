"use client";

import { useToast, ToastOptions } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useEffect, useState } from "react";

export function Toaster() {
  const { toast: toastCallback } = useToast();

  // Local state to store toasts temporarily
const [toasts, setToasts] = useState<Array<ToastOptions & { id: string }>>([]);

  // Intercept toast calls and add to local state
  useEffect(() => {
    const originalToast = toastCallback;
    const patchedToast = (options: ToastOptions) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, ...options }]);
      originalToast(options);

      // auto-remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, options.duration ?? 3000);
    };
    (window as any)._patchedToast = patchedToast; // optional for debugging
  }, [toastCallback]);

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, className }) => (
  <Toast key={id} variant={variant} className={className}>
    <div className="grid gap-1">
      {title && <ToastTitle>{title}</ToastTitle>}
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
    {action && <div>{action}</div>}
    <ToastClose />
  </Toast>
))}

      <ToastViewport />
    </ToastProvider>
  );
}
