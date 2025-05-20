"use client";
import { useState } from "react";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { id } from 'date-fns/locale'; // Indonesian locale
export default function DatePickerDashboard() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  return (
    <div className="flex flex-row gap-x-3">
      <input
        type="date"
        value={startDate || ''}
        onChange={e => setStartDate(e.target.value)}
        className="text-black text-xs border border-gray-400 rounded-md px-1 h-8"
        />
      <input
        type="date"
        value={endDate || ''}
        onChange={e => setEndDate(e.target.value)}
        className="text-black text-xs border border-gray-400 rounded-md px-1 h-8"
      />
    </div>
  );
}