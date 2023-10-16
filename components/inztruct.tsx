'use client';

import AugmentedInstructions from './augmented-instructions';
import { Card, CardContent, CardHeader } from './ui/card';

export default function Inztruct({
  type,
  instructions,
}: {
  type: string;
  instructions: string;
}) {
  return (
    <Card>
      <CardHeader>
        {type === 'user' ? (
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
        <AugmentedInstructions type={type} text={instructions} />
      </CardContent>
    </Card>
  );
}
