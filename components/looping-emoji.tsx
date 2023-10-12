'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';

export default function LoopingEmoji() {
  const [displayEmojis, setDisplayEmojis] = useState<string[]>(['🧠', '🚀', '📱']);

  function randomEmoji() {
    const emojis = ['🧠', '👍', '💡', '🔧', '📈', '🔒', '🌐', '📱', '⚙️', '🚀', '💬'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  const getNextEmojis = () => {
    setDisplayEmojis(prev => prev.map(() => randomEmoji()));
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const emojiRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useIsomorphicLayoutEffect(() => {
    const duration = 0.5;
    const staggerDelay = 0.3;


    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0,
        onRepeat: getNextEmojis,
        defaults: { ease: 'power2.inOut', duration: duration },
      });

      tl.fromTo(
        emojiRefs.map(ref => ref.current),
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          stagger: staggerDelay,
        }
      );
      tl.to(
        emojiRefs.map(ref => ref.current),
        {
          scale: 0,
          opacity: 0,
          stagger: staggerDelay,
        },
        `+=${staggerDelay}`
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex justify-evenly grow">
      {emojiRefs.map((ref, index) => (
        <div ref={ref} key={index} className="text-4xl">
          {displayEmojis[index]}
        </div>
      ))}
    </div>
  );
}
