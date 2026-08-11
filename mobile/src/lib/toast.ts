/**
 * A tiny pub/sub toast so the data hooks can report success and failure
 * without needing React context (the web app used sonner for this).
 */
export type ToastTone = "success" | "error";

export interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}

type Listener = (message: ToastMessage) => void;

const listeners = new Set<Listener>();
let nextId = 0;

export function subscribeToToasts(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(text: string, tone: ToastTone) {
  nextId += 1;
  const message: ToastMessage = { id: nextId, text, tone };
  listeners.forEach((listener) => listener(message));
}

export const toast = {
  success: (text: string) => emit(text, "success"),
  error: (text: string) => emit(text, "error"),
};
