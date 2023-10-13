'use client';

import { Bot, User } from 'lucide-react';
import AugmentedInstructions from './augmented-instructions';

export default function Inztruct({
  type,
  instructions,
}: {
  type: string;
  instructions: string;
}) {
  return (
    <div className="p-8 border rounded flex flex-col items-center gap-4">
      {type === 'user' ? (
        <span className='w-full flex items-center font-bold font-mono uppercase text-xl'>
          👥 User
        </span>
      ) : (
        <span className='w-full flex items-center font-bold font-mono uppercase text-xl'>
          🕵️ Agent
        </span>
      )}
      <AugmentedInstructions type={type} text={instructions} />
    </div>
  );
}
