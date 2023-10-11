import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
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
  const username = user ? user.username : 'Anonymous';

  console.log({
    instructions,
    username,
  });

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `
          Begin the response stating the name of the user: ${username}
          
          Generate 1 paragraph with only 1500 characters (((BE SURE TO USE THE ${username} USERNAME NOT THE name/names/usernames/nicknames IN THE PREVIOUS INSTRUCTIONS))) Make sure generated instructions are no more than 1500 characters and embody the original instructions while also personalizing it based on the ${username}, and base the instructions on this context: ${instructions}
        `,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}