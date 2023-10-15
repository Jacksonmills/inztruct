'use client';

import React, { useState } from 'react';

export default function WordCount({ text }: { text: string }) {
  const [count, setCount] = useState<number>(0);

  React.useEffect(() => {
    setCount(text.length);
  }, [text]);

  return <>{count} / 1500</>;
}
