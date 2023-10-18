'use client';

import { InstructionType, deleteInstructions } from '@/app/actions';
import { useUser } from '@clerk/nextjs';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent } from 'react';
import { toast } from 'sonner';
import AutoSizeTextArea from './auto-size-text-area';
import LoadingBar from './loading-bar';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import WordCount from './word-count';

export default function AugmentedInstructions({
  instructionId,
  type,
  text,
  editable = false,
}: {
  instructionId: number;
  type: InstructionType;
  text: string;
  editable?: boolean;
}) {
  const { isSignedIn } = useUser();
  const router = useRouter();
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

  const onDelete = () => {
    deleteInstructions(type, instructionId)
      .then(() => {
        toast('Instructions deleted', {
          icon: '🗑️',
        });
      })
      .catch(() => {
        toast('Error deleting instructions', {
          icon: '💢',
        });
      });
  };

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
        duration: 10000,
      });
    });
  };

  const lastMessage = messages[messages.length - 1];
  const augmentedInstructions =
    lastMessage?.role === 'assistant' ? lastMessage.content : null;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
        <ScrollArea className="h-48 p-4 w-full rounded-md border-2">
          <AutoSizeTextArea
            input={input}
            handleInputChange={handleInputChange}
            maxLength={1500}
          />
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
            {editable && (
              <>
                <Button type="button">Edit</Button>
                <Button type="button" onClick={onDelete}>
                  Delete
                </Button>
              </>
            )}
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
              <ScrollArea className="h-48 p-4 w-full rounded-md border-2">
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
