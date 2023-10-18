import Inztruct from '@/components/inztruct';
import LoopingEmoji from '@/components/looping-emoji';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { currentUser } from '@clerk/nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

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
                What would you like ChatGPT to know about you to provide better
                responses?
              </CardDescription>
            </CardHeader>
            {/* <CardFooter>
              <Input name="search_user_instructions" placeholder="Search user instructions" />
            </CardFooter> */}
          </Card>
          <div className="flex flex-col gap-8">
            <Suspense fallback={<LoopingEmoji />}>
              {userData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct instructionId={id} type={`user_instructions`} instructions={instructions} editable={true} />
                </div>
              ))}
            </Suspense>
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
            <Suspense fallback={<LoopingEmoji />}>
              {agentData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct instructionId={id} type={`agent_instructions`} instructions={instructions} editable={true} />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
