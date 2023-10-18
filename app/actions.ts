'use server';

import { currentUser } from '@clerk/nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export type InstructionType = 'user_instructions' | 'agent_instructions';

export interface Instruction {
  id: string;
  clerk_id: string;
  instructions: string;
}

export const createInstructions = async (
  instructionType: InstructionType,
  instructions: string
) => {
  const user = await currentUser();
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const validateInstructions = (instructions: string) => {
    const isWithinMinMax =
      instructions.length >= 1 && instructions.length <= 1500;

    return isWithinMinMax;
  };

  if (!validateInstructions(instructions)) {
    console.error('Invalid instructions');
    return;
  }

  const { data, error } = await supabase.from(instructionType).insert({
    clerk_id: user?.id,
    instructions: instructions,
  });

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath('/my-instructions');
  return data;
};

export const deleteInstructions = async (instructionType: InstructionType, id: number) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from(instructionType)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath('/my-instructions');
  return data;
};
