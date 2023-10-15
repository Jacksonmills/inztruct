import { OpenAIStream } from 'ai';
import OpenAI from 'openai';
import { Suspense } from 'react';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function ServerChatCompletion({
  prompt,
}: {
  prompt: string;
}) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const stream = OpenAIStream(response);

  const reader = stream.getReader();

  return (
    <Suspense>
      <Reader reader={reader} />
    </Suspense>
  );
}

async function Reader({
  reader,
}: {
  reader: ReadableStreamDefaultReader<any>;
}) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  const text = new TextDecoder().decode(value);

  return (
    <span>
      {text}
      <Suspense>
        <Reader reader={reader} />
      </Suspense>
    </span>
  );
}
