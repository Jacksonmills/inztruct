import Inztruct from '@/components/inztruct';
import ServerChatCompletion from '@/components/server-chat-completion';
import { currentUser } from '@clerk/nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const revalidate = 0;

function shuffleData(data: Record<string, any>[]) {
  const shuffled = [...data];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

export default async function Home() {
  const user = await currentUser();
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: userData, error: userError } = await supabase
    .from('user_instructions')
    .select()
    .limit(3);

  const { data: agentData, error: agentError } = await supabase
    .from('agent_instructions')
    .select()
    .limit(3);

  if (userError || agentError) return <div>error</div>;

  const shuffledUserData = shuffleData(userData);
  const shuffledAgentData = shuffleData(agentData);
  const userName =
    user?.username || `${user?.firstName} ${user?.lastName}` || null;

  return (
    <div className="flex flex-col gap-12 w-full">
      <h1 className="sr-only">Inztruct Home</h1>
      <h2 className="font-extrabold text-4xl md:text-6xl">
        <ServerChatCompletion
          prompt={`Welcome the user(${userName}(((always directly refer to ${userName}.)))) to our webapp called INZTRUCT(ELEVATOR PITCH:Store and augment instructions for LLM.). ((min: 3 words total. max: 5 words total.)). ((use the word "inztruct" in your message.))((use of word "welcome" not required.))((emojiLimit: 1))`}
        />
      </h2>
      <div className="flex flex-col gap-6">
        <div className="grid lg:grid-cols-2 gap-8 grid-flow-row">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold font-mono sr-only">
              User Instructions
            </h2>
            <div className="flex flex-col gap-8">
              {shuffledUserData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct type="user" instructions={instructions} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold font-mono sr-only">
              Agent Instructions
            </h2>
            <div className="flex flex-col gap-8">
              {shuffledAgentData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct type="agent" instructions={instructions} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
