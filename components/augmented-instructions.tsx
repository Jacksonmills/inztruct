'use client';

import { useChat } from 'ai/react';
import React, { SyntheticEvent } from 'react';
import { toast } from 'sonner';
import LoadingBar from './loading-bar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function AugmentedInstructions({ type, text }: { type: string; text: string; }) {
  const [instructions, setInstructions] = React.useState<string>(text);

  const { input, setInput, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      initialInput: instructions,
      body: {
        type,
        instructions,
      }
    });

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    setInstructions('');
    const formPromise = new Promise((resolve) => {
      setInstructions(input);
      handleSubmit(e);

      resolve(
        setInput(input),
      );
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
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
        <Textarea
          value={input}
          onChange={handleInputChange}
          rows={8}
          cols={60}
          className={`w-full rounded shadow-md p-4 transition border`}
        />
        {!isLoading && (
          <div className='flex gap-2'>
            <Button type="submit" className='w-full'>Augment Instructions</Button>
            <Button type="button" size={`icon`} onClick={() => {
              navigator.clipboard.writeText(input);
              toast('Instructions copied to clipboard', {
                icon: '📋',
              });
            }}>
              📋
            </Button>
          </div>
        )}
        {isLoading && <LoadingBar />}
      </form>
      <output className='w-full'>
        {augmentedInstructions && (
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className="sm:text-4xl text-3xl font-mono font-bold">
                Your augmented instructions
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {augmentedInstructions}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(augmentedInstructions);
                  toast('Instructions copied to clipboard', {
                    icon: '📋',
                  });
                }}
              >
                COPY TO CLIPBOARD
              </Button>
            </div>
          </div>
        )}
      </output>
    </>
  );
}
