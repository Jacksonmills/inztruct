'use client';

import React from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import gsap from 'gsap';

export default function LoadingBar() {
  const loadingContainerRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const [isFlipped, setIsFlipped] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        repeat: -1,
        yoyo: true,
        onRepeat: () => {
          setIsFlipped(prev => {
            return !prev;
          })
        }
      });

      tl.fromTo(progressRef.current, { width: '0%' }, { width: '100%', duration: 1 })
        .fromTo(progressRef.current, { width: '100%' }, { width: '0%', duration: 1 });
    }, loadingContainerRef);

    return () => {
      ctx.revert();
    }
  }, []);

  return (
    <>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-700 dark:text-white">Loading...</span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2.5 dark:bg-black" ref={loadingContainerRef}>
        <div className={`absolute bg-black dark:bg-white h-2.5 rounded-full ${isFlipped ? 'right-0' : ''}`} ref={progressRef} />
      </div>
    </>
  )
}
