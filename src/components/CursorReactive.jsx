import { useEffect } from 'react';

export default function CursorReactive() {
  useEffect(() => {
    const pointer = window.matchMedia('(pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!pointer.matches || motion.matches) return undefined;

    let frame = 0;
    const update = event => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
      });
    };

    window.addEventListener('pointermove', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', update);
      document.documentElement.style.removeProperty('--pointer-x');
      document.documentElement.style.removeProperty('--pointer-y');
    };
  }, []);

  return null;
}
