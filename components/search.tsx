'use client';

import { InstructionType } from '@/app/actions';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Search = ({
  type,
  search,
}: {
  type: InstructionType;
  search: string;
}) => {
  const router = useRouter();
  const [text, setText] = useState(search);

  function slugify(text: string) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const query = slugify(text);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (!query || query === '') {
      params.delete(`${type}_search`);
    } else {
      params.set(`${type}_search`, query);
    }

    router.replace(`/my-instructions?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-2'>
      <Input
        value={text}
        placeholder="Search instructions..."
        onChange={(e) => setText(e.target.value)}
        className='inline-flex flex-grow'
      />

      <Button type="submit">Search</Button>
    </form>
  );
};

export default Search;
