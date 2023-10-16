import Inztruct from '@/components/inztruct';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    .select()
    .eq('clerk_id', user?.id);
  const { data: agentData, error: agentError } = await supabase
    .from('agent_instructions')
    .select()
    .eq('clerk_id', user?.id);

  if (userError || agentError) return <div>error</div>;

  return (
    <div className="flex flex-col gap-12 w-full">
      <h1 className="sr-only">My instructions page</h1>
      <h2 className="font-extrabold text-4xl md:text-6xl">My instructions</h2>
      <div className="grid lg:grid-cols-2 gap-8 grid-flow-row">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>👤 User instructions</CardTitle>
              <CardDescription>
                What would you like ChatGPT to know about you to provide
                better responses?
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="flex flex-col gap-8">
            {userData?.map(({ id, instructions }) => (
              <div key={id}>
                <Inztruct type={`user`} instructions={instructions} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>🕵️ Agent instructions</CardTitle>
              <CardDescription>
                How would you like ChatGPT to respond? Assume a persona or a
                role.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="flex flex-col gap-8">
            {agentData?.map(({ id, instructions }) => (
              <div key={id}>
                <Inztruct type={`agent`} instructions={instructions} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
