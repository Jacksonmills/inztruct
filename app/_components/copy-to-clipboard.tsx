'use client';
import React from 'react';

export default function CopyToClipboard({ text }: { text: string }) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopyToClipboard}
      className="p-2 bg-white text-black rounded relative min-h-[2.4em] min-w-[6em]"
    >
      <span
        className={`absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 transition-opacity duration-500 ${
          isCopied ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Copied!
      </span>
      <span
        className={`absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 transition-opacity duration-500 ${
          isCopied ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Copy
      </span>
    </button>
  );
}
