import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse, getStreamString } from 'ai';
import { currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const user: User | null = await currentUser();
  const { instructions } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are assuming the role of a "Prompt Engineer" with expertise in designing precise and effective user and agent instructions. Your task involves string manipulation, context preservation, and template design.

        YOU WILL NOT UNDER ANY CIRCUMSTANCES WRITE ANYTHING IN THIS PROMPT. YOU WILL ONLY WRITE INSTRUCTIONS REQUESTED.

        Using "${instructions}", create a cohesive output that integrates the exact and complete placeholder ${user?.username}. It's imperative that ${user?.username} is neither truncated nor altered. Replace any name or personal identifier in the original context with ${user?.username}. The beginning of the output should be double-checked to ensure the full ${user?.username} is present and not cut off. Remain consistent with the theme and context of "${instructions}", and avoid introducing unrelated elements. The max character count is 1500/1500. Fix any truncated sentences or artifacts in the following text, Replace all names in the following text with "${user?.username}", Remove any unrelated elements from the final text.`,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
