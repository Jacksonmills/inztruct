import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { type, instructions } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `Generate a markdown document no more than 1500 characters, comprehensive and focused "chatgpt custom instructions" style prompt based on the "${instructions}" given and following ${type === 'user'
          ? 'User Instructions: What would you like ChatGPT to know about you to provide better responses?'
          : 'Agent Instructions: How would you like ChatGPT to respond?'
          }. Keep each "custom instructions" within a 1500 character limit to align with platform constraints like those in ChatGPT apps.`,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
