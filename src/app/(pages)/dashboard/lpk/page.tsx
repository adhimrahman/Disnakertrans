// dashboard/lpk/page.tsx
import React from 'react';
import DashboardLayout from './layout'; // Pastikan path ini sesuai dengan strukt

const LPKPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="content">
        <h2 className="text-2xl font-semibold">Selamat datang di Dashboard LPK!</h2>
        {/* Konten spesifik untuk halaman LPK */}
        <p>Ini adalah halaman utama untuk LPK. Anda bisa menambahkan konten lainnya di sini.</p>
      </div>
    </DashboardLayout>
  );
};

export default LPKPage;
