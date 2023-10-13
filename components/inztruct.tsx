'use client';

import { Bot, User } from 'lucide-react';
import CopyToClipboard from './copy-to-clipboard';

export default function Inztruct({ type, instructions }: { type: string; instructions: string; }) {
  return (
    <div className="p-8 border rounded flex flex-col items-center gap-4">
      {type === 'user' ? <User /> : <Bot />}
      <CopyToClipboard type={type} text={instructions} />
    </div>
  );
}
