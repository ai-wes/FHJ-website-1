import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      options
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options, inView]);

  return [ref, inView];
}
