import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='grid place-content-center h-[80vh]'>
      <SignIn />
    </div>
  );
}
