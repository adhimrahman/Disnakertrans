import Link from "next/link";

// Tipe data untuk pelatihan
type PelatihanItem = {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_pelatihan: string;
  link_form: string;
  tanggal_kegiatan: Date | string;
  updated_at: Date | string;
  created_at: Date | string;
};

// Fungsi dummy untuk simulasi
async function getPelatihanFilteredByJudulContains(search: string, sort: keyof PelatihanItem, order: "asc" | "desc"): Promise<PelatihanItem[]> {
  return [];
}

async function getPelatihanByDateAndSort(sort: keyof PelatihanItem, order: "asc" | "desc"): Promise<PelatihanItem[]> {
  return [];
}

interface PelatihanDashboardPageProps {
  searchParams?: {
    search?: string;
    sort?: keyof PelatihanItem;
    order?: "asc" | "desc";
  };
}

export default async function PelatihanDashboardPage({ searchParams }: PelatihanDashboardPageProps) {
  const {
    search = '',
    sort = 'created_at',
    order = 'asc',
  } = searchParams || {};

  const pelatihan = search
    ? await getPelatihanFilteredByJudulContains(search, sort, order)
    : await getPelatihanByDateAndSort(sort, order);

  // Fungsi untuk memformat tanggal
  const formatDate = (date: Date | string) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto">
          <form className="flex gap-2">
            <input
              type="text"
              name="search"
              placeholder="Cari pelatihan..."
              defaultValue={search}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Cari
            </button>
          </form>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-gray-600">Urutkan:</span>
          <form className="flex gap-2">
            <select
              name="sort"
              defaultValue={sort}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Tanggal Dibuat</option>
              <option value="tanggal_kegiatan">Tanggal Kegiatan</option>
              <option value="judul">Judul</option>
            </select>
            <select
              name="order"
              defaultValue={order}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            <button
              type="submit"
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Terapkan
            </button>
          </form>
        </div>
      </div>

      {/* Table Pelatihan */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Kegiatan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link Docs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pelatihan.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data pelatihan
                </td>
              </tr>
            ) : (
              pelatihan.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.judul}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.tanggal_kegiatan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={item.link_form} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Lihat Dokumen
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      {/* Ikon edit sederhana */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      {/* Ikon hapus sederhana */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}