'use client';

import { useChat } from 'ai/react';
import React, { SyntheticEvent } from 'react';
import { toast } from 'sonner';
import LoadingBar from './loading-bar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function CopyToClipboard({ type, text }: { type: string; text: string; }) {
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
      toast('Instructions augmented', {
        icon: '🎉',
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
      <output>
        {augmentedInstructions && (
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className="sm:text-4xl text-3xl font-mono font-bold">
                Your augmented instructions
              </h2>
            </div>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              {augmentedInstructions
                .substring(augmentedInstructions.indexOf('1') + 3)
                .split('2.')
                .map((augmentedInstructions) => {
                  return (
                    <div
                      className="rounded shadow-md p-4 hover:bg-white/10 transition cursor-pointer border"
                      onClick={() => {
                        navigator.clipboard.writeText(augmentedInstructions);
                        toast('Instructions copied to clipboard', {
                          icon: '📋',
                        });
                      }}
                      key={augmentedInstructions}
                    >
                      <p>{augmentedInstructions}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </output>
    </>
  );
}
