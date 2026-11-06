export {};
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _form_callback?: (id: string) => void;
  }
}
