// hooks/use-toast.ts
import { useCallback } from "react";

// Options for toast notifications
export type ToastOptions = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  className?: string;
};
// Export a singleton toast function directly
export const toast = (options: ToastOptions) => {
  console.log("Toast:", options.title, options.description);
  // You can replace this with a proper UI toast implementation later
};

// Optional hook if you need React hooks context
export function useToast() {
  const toastCallback = useCallback((options: ToastOptions) => {
    toast(options);
  }, []);

  return { toast: toastCallback };
}
