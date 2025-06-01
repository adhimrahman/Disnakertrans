'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchSortControlsProps {
  sortOptions: { value: string; label: string }[];
  defaultSort?: string;
  defaultOrder?: 'asc' | 'desc';
};

export default function SearchSortControls({
  sortOptions,
  defaultSort = "created_at",
  defaultOrder = "asc",
}: SearchSortControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? defaultSort);
  const [order, setOrder] = useState(searchParams.get('order') ?? defaultOrder);
  const [isPending, startTransition] = useTransition();

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    startTransition(() => {
      router.replace(`?search=${val}&sort=${sort}&order=${order}`);
    });
  };

  function onSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSort(val);
    startTransition(() => {
      router.replace(`?search=${search}&sort=${val}&order=${order}`);
    });
  };

  function onOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setOrder(val);
    startTransition(() => {
      router.replace(`?search=${search}&sort=${sort}&order=${val}`);
    });
  };

  return (
    <div className='flex gap-x-6 justify-between'>
      <input type="text" value={search} onChange={onSearchChange} placeholder="Search..."
        className='text-black border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2'
      />
      <div className='flex flex-row gap-x-3 items-center'>
        <p className='text-black text-sm'>Sort by: </p>
        <select value={sort} onChange={onSortChange} className='text-black border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-1'>
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <p className='text-black text-sm'>secara </p>
        <select value={order} onChange={onOrderChange} className='text-black border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-1'>
          <option value="asc">Menurun</option>
          <option value="desc">Menaik</option>
        </select>
      </div>
      {isPending && <p>Loading...</p>}
    </div>
  );
};
