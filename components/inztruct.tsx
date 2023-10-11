'use client';

import React from 'react';
import CopyToClipboard from './copy-to-clipboard';

export default function Inztruct({
  instructions,
}: {
  instructions: string;
}) {
  return (
    <div className="p-8 bg-white/10 border rounded flex flex-col items-center gap-4">
      <CopyToClipboard text={instructions} />
      {/* <p>{instructions}</p> */}
    </div>
  );
}
