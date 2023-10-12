'use client';

import { InstructionType, createInstructions } from '@/app/actions';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useState } from 'react';

export default function CreateInstructionsForm() {
  const [instructionType, setInstructionType] = useState<InstructionType>('user_instructions');
  const [instructions, setInstructions] = useState('');

  const router = useRouter();
  const handleSubmit = () => {
    createInstructions(instructionType, instructions)
      .then(() => {
        toast.success('Instructions created');
      })
      .catch(() => {
        toast.error('Instructions failed to create');
        return;
      })
      .finally(() => {
        router.push('/');
      });
  };

  return (
    <form action={handleSubmit} className='flex flex-col'>
      <h1>Create Instructions</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {instructionType === 'user_instructions' ? 'User Instructions' : 'Agent Instructions'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setInstructionType('user_instructions')}>
            User Instructions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setInstructionType('agent_instructions')}>
            Agent Instructions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <label htmlFor={instructionType}>Instructions</label>
      <textarea
        value={instructions}
        onChange={e => setInstructions(e.target.value)}
        rows={18}
        cols={50}
        className={`w-full rounded shadow-md p-4 hover:bg-white/10 transition border`}
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
