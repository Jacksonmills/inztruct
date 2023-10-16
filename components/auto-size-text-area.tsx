import React, { useEffect, useRef } from 'react';

export default function AutoSizeTextArea({
  input,
  handleInputChange,
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mirrorRef.current && textAreaRef.current) {
      textAreaRef.current.style.height = `${mirrorRef.current.clientHeight}px`;
    }
  }, [input]);

  return (
    <div className="relative">
      <div
        ref={mirrorRef}
        className="absolute w-full left-0 top-0 overflow-hidden opacity-0 pointer-events-none"
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      >
        {input}
      </div>
      <textarea
        ref={textAreaRef}
        value={input}
        onChange={handleInputChange}
        maxLength={1500}
        className={`w-full min-w-max resize-none bg-transparent border-none focus:ring-0 focus:outline-none`}
        style={{ overflow: 'hidden' }}
      />
    </div>
  );
}
