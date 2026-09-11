import * as React from "react";
import { gooeyToast } from "goey-toast";

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  action?: any;
  duration?: number;
  [key: string]: any;
}

function toast(props: ToastProps | string) {
  if (typeof props === "string") {
    return gooeyToast(props);
  }
  const { title, description, variant, action, ...options } = props;
  const titleString = typeof title === "string" ? title : (title ? String(title) : "");
  const toastOptions = {
    description,
    action: action ? (action.label ? { label: action.label, onClick: action.onClick } : action) : undefined,
    ...options,
  };

  if (variant === "destructive") {
    return gooeyToast.error(titleString, toastOptions);
  } else if (variant === "success") {
    return gooeyToast.success(titleString, toastOptions);
  } else if (variant === "warning") {
    return gooeyToast.warning(titleString, toastOptions);
  } else if (variant === "info") {
    return gooeyToast.info(titleString, toastOptions);
  }

  return gooeyToast(titleString, toastOptions);
}

toast.success = (title: string, options?: any) => gooeyToast.success(title, options);
toast.error = (title: string, options?: any) => gooeyToast.error(title, options);
toast.warning = (title: string, options?: any) => gooeyToast.warning(title, options);
toast.info = (title: string, options?: any) => gooeyToast.info(title, options);
toast.dismiss = (id?: string | number) => gooeyToast.dismiss(id);
toast.promise = (promise: any, data: any) => gooeyToast.promise(promise, data);
toast.update = (id: string | number, options: any) => gooeyToast.update(id, options);

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string | number) => gooeyToast.dismiss(toastId),
    toasts: [],
  };
}

export { useToast, toast };

