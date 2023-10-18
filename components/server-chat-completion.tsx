import { OpenAIStream } from 'ai';
import OpenAI from 'openai';
import { Suspense } from 'react';
import ElevenLabsAudio from './elevenlabs-audio';

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

  let chunks = [];
  let result;
  while (!(result = await reader.read()).done) {
    chunks.push(new TextDecoder().decode(result.value));
  }
  const fullMessage = chunks.join('');

  return (
    <div className="flex items-center gap-6">
      <div className="flex-shrink">
        <ElevenLabsAudio transcript={fullMessage} />
      </div>
      <Suspense>
        <ChunkReader savedChunks={chunks} />
      </Suspense>
    </div>
  );
}

async function ChunkReader({ savedChunks }: { savedChunks: string[] }) {
  // Use the saved chunks to render the text
  return <span>{savedChunks.join('')}</span>;
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
