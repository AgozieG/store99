import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return undefined;

    const root = document.documentElement;
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px' });

    const observeReveals = () => document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(element => observer.observe(element));
    observeReveals();
    const mutations = new MutationObserver(observeReveals);
    mutations.observe(document.querySelector('main'), { childList: true, subtree: true });

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportCenter = window.innerHeight * 0.5;
      document.querySelectorAll('[data-parallax]').forEach(element => {
        const speed = Number(element.dataset.parallax || 0.1);
        const offset = Math.max(-72, Math.min(72, (viewportCenter - element.getBoundingClientRect().top) * speed));
        element.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
      });
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty('--scroll-progress', `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`);
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    return () => {
      observer.disconnect(); mutations.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate); window.removeEventListener('resize', requestUpdate);
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true"/>;
}
