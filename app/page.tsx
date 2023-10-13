import Inztruct from '@/components/inztruct';
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
    .select();

  const { data: agentData, error: agentError } = await supabase
    .from('agent_instructions')
    .select();

  if (userError || agentError) return <div>error</div>;

  const shuffledUserData = shuffleData(userData);
  const shuffledAgentData = shuffleData(agentData);

  return (
    <div className='flex flex-col gap-12'>
      <h1 className='sr-only'>Inztruct Home</h1>
      <h2 className='font-extrabold text-4xl md:text-6xl'>Welcome{user && `, ${user?.username}`}!</h2>
      <div className='flex flex-col gap-6'>
        <div className="grid md:grid-cols-2 gap-8 grid-flow-row">
          <div className='flex flex-col gap-4'>
            <h2 className="text-xl font-bold font-mono">User Instructions</h2>
            <div className='flex flex-col gap-8'>
              {shuffledUserData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct type="user" instructions={instructions} />
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h2 className="text-xl font-bold font-mono">Agent Instructions</h2>
            <div className='flex flex-col gap-8'>
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
