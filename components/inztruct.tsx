'use client';

import CopyToClipboard from './copy-to-clipboard';

export default function Inztruct({ instructions }: { instructions: string; }) {
  return (
    <div className="p-8 border rounded flex flex-col items-center gap-4">
      <CopyToClipboard text={instructions} />
    </div>
  );
}
