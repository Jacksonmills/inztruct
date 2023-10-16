'use client';

import { InstructionType, createInstructions } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import AutoSizeTextArea from './auto-size-text-area';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import WordCount from './word-count';

export default function CreateInstructionsForm() {
  const [instructionType, setInstructionType] =
    useState<InstructionType>('user_instructions');
  const [userInstructions, setUserInstructions] = useState<string>('');
  const [agentInstructions, setAgentInstructions] = useState<string>('');

  const router = useRouter();
  const handleSubmit = () => {
    let nextInstructions = userInstructions;
    if (instructionType === 'agent_instructions')
      nextInstructions = agentInstructions;
    createInstructions(instructionType, nextInstructions)
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
    <Tabs defaultValue="user" className="min-w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          className="flex items-center gap-2"
          value="user"
          onClick={() => setInstructionType('user_instructions')}
        >
          👤 User
        </TabsTrigger>
        <TabsTrigger
          className="flex items-center gap-2"
          value="agent"
          onClick={() => setInstructionType('agent_instructions')}
        >
          🕵️ Agent
        </TabsTrigger>
      </TabsList>
      <TabsContent value="user">
        <Card>
          <CardHeader>
            <CardTitle>👤 User Instructions</CardTitle>
            <CardDescription>
              What would you like ChatGPT to know about you to provide better
              responses?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <form action={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <Label htmlFor="user_instructions">Instructions</Label>
                  <ScrollArea className="h-48 p-4 w-full rounded-md border">
                    <AutoSizeTextArea
                      name="user_instructions"
                      input={userInstructions}
                      handleInputChange={(e) =>
                        setUserInstructions(e.target.value)
                      }
                      maxLength={1500}
                    />
                  </ScrollArea>
                </div>
                <Button type="submit">
                  Create <WordCount text={userInstructions} />
                </Button>
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
              <form action={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <Label htmlFor="agent_instructions">Instructions</Label>
                  <ScrollArea className="h-48 p-4 w-full rounded-md border">
                    <AutoSizeTextArea
                      name="agent_instructions"
                      input={agentInstructions}
                      handleInputChange={(e) =>
                        setAgentInstructions(e.target.value)
                      }
                      maxLength={1500}
                    />
                  </ScrollArea>
                </div>
                <Button type="submit">
                  Create <WordCount text={agentInstructions} />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
