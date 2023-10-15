import CreateInstructionsForm from '@/components/create-instructions-form';

export default async function Home() {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-extrabold text-4xl md:text-6xl">
        Create Instructions
      </h1>
      <CreateInstructionsForm />
    </div>
  );
}
