'use client';

import React, { ComponentProps, useEffect, useRef } from 'react';

export interface AutoSizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  input: string;
  handleInputChange: ComponentProps<'textarea'>['onChange'];
}

export default function AutoSizeTextArea({
  input,
  handleInputChange,
  ...props
}: AutoSizeTextareaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mirrorRef.current && textAreaRef.current) {
      textAreaRef.current.style.height = `${mirrorRef.current.clientHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!containerRef.current && !textAreaRef.current) return;

    const container = containerRef.current;

    container?.addEventListener('click', () => {
      textAreaRef.current?.focus();
    });
  }, []);

  return (
    <div className="relative h-48" ref={containerRef}>
      <div
        ref={mirrorRef}
        className="absolute w-full left-0 top-0 overflow-hidden opacity-0 pointer-events-none"
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      >
        {input}
      </div>
      <textarea
        {...props}
        ref={textAreaRef}
        value={input}
        onChange={handleInputChange}
        className={`w-full min-w-max min-h-full resize-none bg-transparent border-none focus:ring-0 focus:outline-none`}
        style={{ overflow: 'hidden' }}
      />
    </div>
  );
}
