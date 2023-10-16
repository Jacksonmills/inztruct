'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import HamburgerMenu from './hamburger-menu';
import { Logo } from './logo';
import LoopingEmoji from './looping-emoji';
import { Button } from './ui/button';

export default function Header() {
  const { isSignedIn } = useAuth();

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
      border-b-2
    "
    >
      <div className="flex md:hidden">
        {isSignedIn ? (
          <HamburgerMenu />
        ) : (
          <Link href="/" className="text-lg">
            <Logo shouldBreak={true} />
          </Link>
        )}
      </div>
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="text-2xl md:text-4xl lg:text-6xl">
          <Logo />
        </Link>
        {isSignedIn && (
          <>
            <Link href="/create">
              <Button>Create</Button>
            </Link>
            <Link href="/my-instructions">
              <Button>My instructions</Button>
            </Link>
          </>
        )}
      </nav>
      <div className="hidden md:flex flex-grow">
        <LoopingEmoji />
      </div>
      {isSignedIn ? (
        <UserButton afterSignOutUrl={`/sign-in`} />
      ) : (
        <Link href="/sign-in">
          <Button>Sign in</Button>
        </Link>
      )}
    </header>
  );
}
