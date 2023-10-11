import { UserButton, currentUser } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Inztruct from '@/components/inztruct';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function Home() {
  const user = await currentUser();
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: userData, error: userError } = await supabase
    .from('user_instructions')
    .select('*')
    .eq('clerk_id', user?.id);

  const { data: agentData, error: agentError } = await supabase
    .from('agent_instructions')
    .select('*')
    .eq('clerk_id', user?.id);

  if (userError || agentError) return <div>error</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full flex items-center justify-between">
        <Logo />
        <div className='flex gap-2 items-center'>
          <Button>
            Create Instructions
          </Button>
          <UserButton />
          <ThemeToggle />
        </div>
      </div>

      <div className="h-[4em]" />

      <div className="grid grid-cols-2 gap-8 grid-flow-row">
        <div>
          <h2 className="text-xl font-bold font-mono">User Instructions</h2>
          {userData?.map(({ id, instructions }) => (
            <div key={id}>
              <Inztruct instructions={instructions} />
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold font-mono">Agent Instructions</h2>
          {agentData?.map(({ id, instructions }) => (
            <div key={id}>
              <Inztruct instructions={instructions} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
