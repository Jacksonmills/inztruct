import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import HamburgerMenu from './hamburger-menu';
import { Logo } from './logo';
import LoopingEmoji from './looping-emoji';
import { Button } from './ui/button';

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
      <div className="flex md:hidden">
        <HamburgerMenu />
      </div>
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="text-4xl md:text-6xl">
          <Logo />
        </Link>
        <SignedIn>
          <Link href="/create">
            <Button>Create</Button>
          </Link>
          <Link href="/my-instructions">
            <Button>My Instructions</Button>
          </Link>
        </SignedIn>
      </nav>
      <LoopingEmoji />
      <SignedIn>
        <UserButton afterSignOutUrl={`/sign-in`} />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </SignedOut>
    </header>
  );
}
