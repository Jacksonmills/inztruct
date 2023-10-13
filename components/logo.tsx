'use client';

import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-4">
      <span className="font-extrabold text-4xl md:text-6xl">InZtruct</span>
    </Link>
  );
};
