'use client';

import React from 'react';
import gsap from 'gsap';
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect';

export const Logo = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      logoRef.current && (tl.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }));
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <h1 className="font-bold text-6xl font-mono" ref={logoRef}>INZTRUCT</h1>
    </div>
  );
};
