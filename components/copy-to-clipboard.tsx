'use client';

import { useChat } from 'ai/react';
import React, { SyntheticEvent } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import LoadingBar from './loading-bar';

export default function CopyToClipboard({ text }: { text: string; }) {
  const [instructions, setInstructions] = React.useState<string>(text);

  const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat({
    initialInput: instructions,
    body: {
      instructions,
    },
    onResponse: () => {
      toast('Instructions generated', {
        icon: '🎉',
      });
    },
  });

  const onSubmit = (
    e: SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setInstructions(input);
    handleSubmit(e);
  };

  const lastMessage = messages[messages.length - 1];
  const generatedInstructions = lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <>
      <form onSubmit={onSubmit} className='flex flex-col gap-6 w-full'>
        <textarea
          value={input}
          onChange={handleInputChange}
          rows={18}
          cols={50}
          className={`w-full rounded shadow-md p-4 hover:bg-white/10 transition border`}
        />
        {!isLoading && (
          <Button
            type="submit"
          >
            Generate Instructions
          </Button>
        )}
        {isLoading && (
          <LoadingBar />
        )}
      </form>
      <output className="space-y-10 my-10">
        {generatedInstructions && (
          <>
            <div>
              <h2
                className="sm:text-4xl text-3xl font-mono font-bold"
              >
                Your generated instructions
              </h2>
            </div>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              {generatedInstructions
                .substring(generatedInstructions.indexOf('1') + 3)
                .split('2.')
                .map((generatedInstructions) => {
                  return (
                    <div
                      className="rounded shadow-md p-4 hover:bg-white/10 transition cursor-pointer border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedInstructions);
                        toast('Instructions copied to clipboard', {
                          icon: '📋',
                        });
                      }}
                      key={generatedInstructions}
                    >
                      <p>{generatedInstructions}</p>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </output>
    </>
  );
}
