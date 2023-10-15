'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Logo } from './logo';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export default function HamburgerMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={`left`}>
        <SheetHeader className="flex gap-3">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <nav className="flex flex-col gap-6">
            <Link
              href="/"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Button className="w-full">Home</Button>
            </Link>
            <Link
              href="/create"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Button className="w-full">Create</Button>
            </Link>
            <Link
              href="/my-instructions"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Button className="w-full">My Instructions</Button>
            </Link>
          </nav>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
