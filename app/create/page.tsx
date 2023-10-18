import { createInstructions } from '@/app/actions';
import CreateInstructionsForm from '@/components/create-instructions-form';

export default async function Home() {
  return (
    <div className="flex flex-col gap-12 w-full lg:max-w-4xl">
      <h1 className="font-extrabold text-4xl md:text-6xl">
        Create instructions
      </h1>
      <CreateInstructionsForm createInstructions={createInstructions} />
    </div>
  );
}
