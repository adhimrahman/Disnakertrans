export default function AccountsPage() { 
  return (
    <div className="flex flex-col gap-y-12">
      <div className='flex flex-row gap-x-2 justify-between w-2xs'>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-28 rounded-lg"
          >
            Tambah
          </button>
          <button
            type="reset"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 w-28 rounded-lg"
          >
            Edit
          </button>
      </div>
      <div>
        <table className="min-w-full table-auto shadow-sm rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b text-black">No</th>
              <th className="px-4 py-2 text-left border-b text-black">Username</th>
              <th className="px-4 py-2 text-left border-b text-black">Password</th>
              <th className="px-4 py-2 text-left border-b text-black">Nama LPK</th>
              <th className="px-4 py-2 text-left border-b text-black">Alamat LPK</th>
              <th className="px-4 py-2 text-left border-b text-black">Kontak</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-black">1</td>
              <td className="px-4 py-2 border-b text-black">Pelatihan Kerja</td>
              <td className="px-4 py-2 border-b text-black">12 April 2025</td>
              <td className="px-4 py-2 border-b text-green-600">Aktif</td>
              <td className="px-4 py-2 border-b text-black">
                <button className="text-blue-600 hover:underline">Lihat</button>
              </td>
              <td className="px-4 py-2 border-b text-black">dummy@gmail.com</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-black">2</td>
              <td className="px-4 py-2 border-b text-black">Magang Industri</td>
              <td className="px-4 py-2 border-b text-black">1 Mei 2025</td>
              <td className="px-4 py-2 border-b text-yellow-600">Pending</td>
              <td className="px-4 py-2 border-b text-black">
                <button className="text-blue-600 hover:underline">Lihat</button>
              </td>
              <td className="px-4 py-2 border-b text-black">dummy@gmail.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
  );
}