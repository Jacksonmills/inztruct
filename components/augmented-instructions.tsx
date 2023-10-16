'use client';

import { useUser } from '@clerk/nextjs';
import { useChat } from 'ai/react';
import React, { SyntheticEvent } from 'react';
import { toast } from 'sonner';
import LoadingBar from './loading-bar';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import WordCount from './word-count';
import AutoSizeTextArea from './auto-size-text-area';

export default function AugmentedInstructions({
  type,
  text,
}: {
  type: string;
  text: string;
}) {
  const { isSignedIn } = useUser();
  const [instructions, setInstructions] = React.useState<string>(text);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    messages,
  } = useChat({
    initialInput: instructions,
    body: {
      type,
      instructions,
    },
  });

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    setInstructions('');
    const formPromise = new Promise((resolve) => {
      setInstructions(input);
      handleSubmit(e);

      resolve(setInput(input));
    });

    formPromise.then(() => {
      toast('Instructions augmenting...', {
        icon: '🧪',
        duration: 5000,
      });
    });
  };

  const lastMessage = messages[messages.length - 1];
  const augmentedInstructions =
    lastMessage?.role === 'assistant' ? lastMessage.content : null;

  return (
    <div className='flex flex-col gap-6'>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
        <ScrollArea className="h-48 p-4 w-full rounded-md border">
          <AutoSizeTextArea input={input} handleInputChange={handleInputChange} />
        </ScrollArea>
        {!isLoading && (
          <div className="flex gap-2">
            <Button type="submit" className="w-full" disabled={!isSignedIn}>
              {isSignedIn ? (
                <>
                  Augment <WordCount text={input} />
                </>
              ) : (
                'Sign in to augment'
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size={`icon`}
              onClick={() => {
                navigator.clipboard.writeText(input);
                toast('Instructions copied to clipboard', {
                  icon: '📋',
                });
              }}
            >
              📋
            </Button>
          </div>
        )}
        {isLoading && <LoadingBar />}
      </form>
      <output className="w-full">
        {augmentedInstructions && (
          <div className="flex flex-col gap-4">
            <h2 className="sm:text-4xl text-3xl font-mono font-bold">
              Your augmented instructions
            </h2>
            <div className="flex flex-col gap-4">
              <ScrollArea className="h-48 p-4 w-full rounded-md border">
                {augmentedInstructions}
              </ScrollArea>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(augmentedInstructions);
                  toast('Instructions copied to clipboard', {
                    icon: '📋',
                  });
                }}
              >
                📋 Copy augmented instructions
              </Button>
            </div>
          </div>
        )}
      </output>
    </div>
  );
}
