'use client';

import { InstructionType, createInstructions } from '@/app/actions';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

export default function CreateInstructionsForm() {
  const [instructionType, setInstructionType] = useState<InstructionType>('user_instructions');
  const [instructions, setInstructions] = useState('');

  const router = useRouter();
  const handleSubmit = () => {
    createInstructions(instructionType, instructions)
      .then(() => {
        toast.success('Instructions created');
      })
      .then(() => {
        return router.push('/my-instructions');
      })
      .catch(() => {
        toast.error('Instructions failed to create');
        return;
      });
  };

  return (
    <Tabs defaultValue="user">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger className='flex items-center gap-2' value="user" onClick={() => setInstructionType('user_instructions')}>👤 User</TabsTrigger>
        <TabsTrigger className='flex items-center gap-2' value="agent" onClick={() => setInstructionType('agent_instructions')}>🕵️ Agent</TabsTrigger>
      </TabsList>
      <TabsContent value="user">
        <Card>
          <CardHeader>
            <CardTitle>👤 User Instructions</CardTitle>
            <CardDescription>
              What would you like ChatGPT to know about you to provide better responses?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <form action={handleSubmit} className='flex flex-col gap-6'>
                <div>
                  <Label htmlFor="user_instructions">Instructions</Label>
                  <Textarea
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    rows={8}
                    cols={50}
                    className={`w-full rounded shadow-md p-4 hover:bg-white/10 transition border`}
                  />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="agent">
        <Card>
          <CardHeader>
            <CardTitle>🕵️ Agent Instructions</CardTitle>
            <CardDescription>
              How would you like ChatGPT to respond?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <form action={handleSubmit} className='flex flex-col gap-6'>
                <div>
                  <Label htmlFor="agent_instructions">Instructions</Label>
                  <Textarea
                    name="agent_instructions"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    rows={8}
                    cols={50}
                    className={`w-full rounded shadow-md p-4 hover:bg-white/10 transition border`}
                  />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

