import Inztruct from '@/components/inztruct';
import { Logo } from '@/components/logo';
import ServerChatCompletion from '@/components/server-chat-completion';
import TiltedMarquee from '@/components/tilted-marquee';
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
      <div className="flex flex-col w-full items-center justify-center lg:p-32 gap-6">
        <h1 className="text-6xl lg:text-8xl flex items-center">
          <Logo />
        </h1>
        <p className="text-xl text-center lg:max-w-5xl">
          <ServerChatCompletion
            prompt={`Welcome the user(${userName}(((always directly refer to ${userName}.)))) to our webapp called INZTRUCT(ELEVATOR PITCH:Store and augment instructions for LLM.). ((min: 3 words total. max: 5 words total.)). ((use the word "inztruct" in your message.))((use of word "welcome" not required.))((emojiLimit: 1))`}
          />
        </p>
      </div>
      <TiltedMarquee />
      <div className="flex flex-col gap-6">
        <h2>
          <span className="text-2xl font-bold font-mono">
            Example Instructions
          </span>
        </h2>
        <div className="grid lg:grid-cols-2 gap-8 grid-flow-row">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold font-mono sr-only">
              User Instructions
            </h3>
            <div className="flex flex-col gap-8">
              {shuffledUserData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct type="user" instructions={instructions} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold font-mono sr-only">
              Agent Instructions
            </h3>
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
