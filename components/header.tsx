import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import LoopingEmoji from './looping-emoji';

export default function Header() {
  return (
    <header
      className="
      w-full
      flex
      flex-wrap
      gap-6
      items-center
      justify-between
      p-6
      border-b
    "
    >
      <nav className="flex gap-6 items-center">
        <Logo />
        <Link href="/create">
          <Button>Create</Button>
        </Link>
      </nav>
      <LoopingEmoji />
      <UserButton />
    </header>
  );
}
