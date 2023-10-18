import Inztruct from '@/components/inztruct';
import LoopingEmoji from '@/components/looping-emoji';
import Search from '@/components/search';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { currentUser } from '@clerk/nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export const revalidate = 0;

async function fetchInstructions(type: string, searchString: string) {
  const user = await currentUser();
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  let query = supabase
    .from(type)
    .select()
    .eq('clerk_id', user?.id);

  if (searchString !== '') {
    query = query.textSearch('instructions', searchString);
  }

  const { data, error } = await query.select();

  if (error) {
    return { error };
  }

  return { data };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userSearch = searchParams['user_instructions_search'] as
    | string
    | undefined;
  const agentSearch = searchParams['agent_instructions_search'] as
    | string
    | undefined;
  const userSearchString = userSearch
    ? handleSearchStringForSupabase(userSearch)
    : '';
  const agentSearchString = agentSearch
    ? handleSearchStringForSupabase(agentSearch)
    : '';

  function handleSearchStringForSupabase(searchString: string) {
    if (!searchString.includes('-')) return searchString;
    return searchString.split('-').join(' | ');
  }

  const { data: userData, error: userError } = await fetchInstructions(
    'user_instructions',
    userSearchString
  );
  const { data: agentData, error: agentError } = await fetchInstructions(
    'agent_instructions',
    agentSearchString
  );

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
            <CardFooter>
              <Search type="user_instructions" search={userSearchString} />
            </CardFooter>
          </Card>
          <div className="flex flex-col gap-8">
            <Suspense fallback={<LoopingEmoji />}>
              {userData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct
                    instructionId={id}
                    type={`user_instructions`}
                    instructions={instructions}
                    editable={true}
                  />
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
            <CardFooter>
              <Search type="agent_instructions" search={agentSearchString} />
            </CardFooter>
          </Card>
          <div className="flex flex-col gap-8">
            <Suspense fallback={<LoopingEmoji />}>
              {agentData?.map(({ id, instructions }) => (
                <div key={id}>
                  <Inztruct
                    instructionId={id}
                    type={`agent_instructions`}
                    instructions={instructions}
                    editable={true}
                  />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
