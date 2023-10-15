'use client';

import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import gsap from 'gsap';
import React from 'react';

export default function FloatingEmoji() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const emojiRefs = [
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ];

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 2 },
      });

      tl.to(
        emojiRefs.map((ref) => ref.current),
        {
          scrollTrigger: {
            trigger: emojiRefs.map((ref) => ref.current),
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
          y: 50,
          stagger: 0.5,
        },
        0
      );
    }, containerRef);

    () => ctx.kill();
  }, []);

  return (
    <div ref={containerRef} className="opacity-5">
      <div
        ref={emojiRefs[0]}
        className="z-0 select-none pointer-events-none absolute text-[300px] top-32 right-[-10vw]"
      >
        👁️
      </div>
      <div
        ref={emojiRefs[1]}
        className="z-0 select-none pointer-events-none absolute text-[300px] top-1/2 right-2/4"
      >
        📋
      </div>
      <div
        ref={emojiRefs[2]}
        className="z-0 select-none pointer-events-none absolute text-[300px] bottom-9 right-[-10vw]"
      >
        🧠
      </div>
    </div>
  );
}
