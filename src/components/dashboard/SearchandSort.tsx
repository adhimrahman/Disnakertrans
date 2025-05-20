'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchSortControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  // const startDate = searchParams.get('startDate') ?? '';
  // const endDate = searchParams.get('endDate') ?? '';
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'Tanggal');
  const [order, setOrder] = useState(searchParams.get('order') ?? 'asc');
  const [isPending, startTransition] = useTransition();

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    startTransition(() => {
      router.replace(`?search=${val}&sort=${sort}&order=${order}`);
    });
  }

  function onSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSort(val);
    startTransition(() => {
      router.replace(`?search=${search}&sort=${val}&order=${order}`);
    });
  }

  function onOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setOrder(val);
    startTransition(() => {
      router.replace(`?search=${search}&sort=${sort}&order=${val}`);
    });
  }

  return (
    <div className='flex flex-row gap-x-3 items-center'>
      <input type="text" value={search} onChange={onSearchChange} placeholder="Search..."
        className='text-black border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2'
      />
      <p className='text-black text-sm'>Sort by: </p>
      <select value={sort} onChange={onSortChange} className='text-black border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-1'>
        <option value="Judul" className='text-black text-sm'>Judul</option>
        <option value="Tanggal">Tanggal</option>
      </select>
      <p className='text-black text-sm'>secara </p>
      <select value={order} onChange={onOrderChange} className='text-black border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-1'>
        <option value="asc">Menaik</option>
        <option value="desc">Menurun</option>
      </select>
      {isPending && <p>Loading...</p>}
    </div>
  );
}
