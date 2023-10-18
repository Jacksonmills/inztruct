'use client';

import { InstructionType } from '@/app/actions';
import AugmentedInstructions from './augmented-instructions';
import { Card, CardContent, CardHeader } from './ui/card';

export default function Inztruct({
  instructionId,
  type,
  instructions,
  editable = false,
}: {
  instructionId: number;
  type: InstructionType;
  instructions: string;
  editable?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        {type === 'user_instructions' ? (
          <span className="w-full flex items-center font-bold font-mono text-xl">
            👥 User
          </span>
        ) : (
          <span className="w-full flex items-center font-bold font-mono text-xl">
            🕵️ Agent
          </span>
        )}
      </CardHeader>
      <CardContent>
        <AugmentedInstructions
          instructionId={instructionId}
          type={type}
          text={instructions}
          editable={editable}
        />
      </CardContent>
    </Card>
  );
}
