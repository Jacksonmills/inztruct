'use client';

import { InstructionType, createInstructions } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const [promptInstructionsInput, setPromptInstructionsInput] =
    useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [body, setBody] = useState({
    type: instructionType,
    prompt: promptInstructionsInput,
  });

  const instructionTypeRef = useRef(instructionType);

  useEffect(() => {
    instructionTypeRef.current = instructionType;
  }, [instructionType]);

  useEffect(() => {
    setBody({
      type: instructionType,
      prompt: promptInstructionsInput,
    });
  }, [instructionType, promptInstructionsInput]);

  const router = useRouter();
  const { input, handleInputChange, handleSubmit, messages, isLoading } =
    useChat({
      api: '/api/prompt-instructions',
      body: body,
    });

  const handlePrompt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    new Promise((resolve) => {
      setPromptInstructionsInput(input);
      resolve(null);
    })
      .then(() => {
        handleSubmit(e);
      })
      .then(() => {
        toast('Initial instructions generating...', {
          icon: '🧠',
          duration: 10000,
        });
      });
  };

  const lastMessage = messages[messages.length - 1];
  let generatedInstructions =
    lastMessage?.role === 'assistant' ? lastMessage.content : null;

  useEffect(() => {
    if (!generatedInstructions) return;

    if (instructionTypeRef.current === 'user_instructions') {
      setUserInstructions(generatedInstructions);
    } else {
      setAgentInstructions(generatedInstructions);
    }
  }, [generatedInstructions]);

  const handleSubmitCreate = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let nextInstructions = userInstructions;
    if (instructionType === 'agent_instructions')
      nextInstructions = agentInstructions;
    createInstructions(instructionType, nextInstructions)
      .then(() => {
        toast.success('Instructions created');
      })
      .then(() => {
        setIsSubmitting(false);
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
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isLoading ||
                      userInstructions.length > 1500
                    }
                  >
                    {isSubmitting ? (
                      'Creating...'
                    ) : (
                      <>
                        Create <WordCount text={userInstructions} />
                      </>
                    )}
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
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isLoading ||
                      agentInstructions.length > 1500
                    }
                  >
                    {isSubmitting ? (
                      'Creating...'
                    ) : (
                      <>
                        Create <WordCount text={agentInstructions} />
                      </>
                    )}
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
          <p>
            Results may be more than the maximum 1500 character limit. Please
            edit to desired length before creating.
          </p>
          <form onSubmit={handlePrompt}>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask GPT to create an initial instructions prompt..."
            />
          </form>
        </div>
      </div>
    </div>
  );
}
