'use client';

import { InstructionType, createInstructions } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChat } from 'ai/react';
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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import WordCount from './word-count';

export default function CreateInstructionsForm() {
  const [instructionType, setInstructionType] =
    useState<InstructionType>('user_instructions');
  const [userInstructions, setUserInstructions] = useState<string>('');
  const [agentInstructions, setAgentInstructions] = useState<string>('');
  const [promptInstructions, setPromptInstructions] = useState<string>('');

  const router = useRouter();
  const { input, handleInputChange, handleSubmit, messages, isLoading } =
    useChat({
      api: '/api/prompt-instructions',
      body: {
        type: instructionType,
        instructions: promptInstructions,
      },
    });

  const handlePrompt = (e: React.FormEvent<HTMLFormElement>) => {
    setPromptInstructions(input);
    handleSubmit(e);

    toast('Initial instructions generating...', {
      icon: '🧠',
      duration: 10000,
    });
  };

  const handleSubmitCreate = () => {
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

  const lastMessage = messages[messages.length - 1];
  const generatedInstructions =
    lastMessage?.role === 'assistant' ? lastMessage.content : null;

  return (
    <div className="w-full flex flex-col gap-6">
      <Tabs defaultValue="user" className="w-full">
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
              <CardTitle>👤 User instructions</CardTitle>
              <CardDescription>
                What would you like ChatGPT to know about you to provide better
                responses?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <form
                  action={handleSubmitCreate}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <Label htmlFor="user_instructions">Instructions</Label>
                    <ScrollArea className="h-48 p-4 w-full rounded-md border-2">
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
              <CardTitle>🕵️ Agent instructions</CardTitle>
              <CardDescription>
                How would you like ChatGPT to respond?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <form
                  action={handleSubmitCreate}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <Label htmlFor="agent_instructions">Instructions</Label>
                    <ScrollArea className="h-48 p-4 w-full rounded-md border-2">
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

      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col gap-2">
          <h2 className="font-extrabold text-2xl md:text-4xl">
            Prompt initial instructions
          </h2>
          <form onSubmit={handlePrompt}>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask GPT to create an initial instructions prompt..."
            />
          </form>
        </div>
        <output className="w-full">
          {generatedInstructions && (
            <div className="flex flex-col gap-4">
              <h2 className="sm:text-4xl text-3xl font-mono font-bold">
                Your initial instructions
              </h2>
              <div className="flex flex-col gap-4">
                <ScrollArea className="h-48 p-4 w-full rounded-md border-2">
                  {generatedInstructions}
                </ScrollArea>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedInstructions);
                    toast('Instructions copied to clipboard', {
                      icon: '📋',
                    });
                  }}
                >
                  📋 Copy initial instructions
                </Button>
              </div>
            </div>
          )}
        </output>
      </div>
    </div>
  );
}
