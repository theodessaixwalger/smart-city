import { useRef } from "react";

export default function useDebounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  const timeout = useRef<NodeJS.Timeout>();

  return (...args: Parameters<T>) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => func(...args), delay);
  };
}