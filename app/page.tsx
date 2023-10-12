import Inztruct from '@/components/inztruct';
import { currentUser } from '@clerk/nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const revalidate = 0;

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

  return (
    <div className='flex flex-col gap-12'>
      <h2 className='text-4xl font-bold'>Welcome{user && `, ${user?.username}`}!</h2>
      <div className='flex flex-col gap-6'>
        <h3 className='text-2xl font-bold'>Featured instructions</h3>
        <div className="grid md:grid-cols-2 gap-8 grid-flow-row">
          <div className='flex flex-col gap-4'>
            <h2 className="text-xl font-bold font-mono">User Instructions</h2>
            <div className='flex flex-col gap-8'>
              {userData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct instructions={instructions} />
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h2 className="text-xl font-bold font-mono">Agent Instructions</h2>
            <div className='flex flex-col gap-8'>
              {agentData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct instructions={instructions} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
