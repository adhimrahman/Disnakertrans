const trainings = [
  {
    id: 1,
    jenisPelatihan: "Pelatihan Kerja",
    waktuPelatihan: "12 April 2025",
    statusPendaftar: "Aktif",
    pria: 50,
    wanita: 30,
    jurusan: "Lihat",
    email: "dummy@gmail.com",
  },
  {
    id: 2,
    jenisPelatihan: "Magang Industri",
    waktuPelatihan: "1 Mei 2025",
    statusPendaftar: "Pending",
    pria: 20,
    wanita: 15,
    jurusan: "Lihat",
    email: "dummy@gmail.com",
  },
];

export default function LaporanLpkPage() {
  return (
    <div className="flex flex-col gap-y-12">
      <div className='flex flex-row gap-x-2 justify-between w-2xs'>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 shadow-xl shadow-blue-500/50 text-white font-bold py-2 px-4 w-28 rounded-lg"
        >
          Tambah
        </button>
        <button
          type="reset"
          className="bg-gray-500 hover:bg-gray-700 shadow-xl shadow-gray-700/50 text-white font-bold py-2 px-4 w-28 rounded-lg"
        >
          Edit
        </button>
      </div>
      <div>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-black font-light">No</th>
            <th className="px-4 py-2 border text-black font-light">Jenis Pelatihan</th>
            <th className="px-4 py-2 border text-black font-light">Waktu Pelatihan</th>
            <th className="px-4 py-2 border text-black font-light">Jumlah Pendaftar</th>
            <th className="px-4 py-2 border text-black font-light">Jurusan</th>
            <th className="px-4 py-2 border text-black font-light">Jumlah Peserta Lulus</th>
            <th className="px-4 py-2 border text-black font-light">Laporan Lengkap</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((training) => (
            <tr key={training.id}>
              <td className="px-4 py-2 border">{training.id}</td>
              <td className="px-4 py-2 border">{training.jenisPelatihan}</td>
              <td className="px-4 py-2 border">{training.waktuPelatihan}</td>
              <td className="px-4 py-2 border">
                <div>
                  <span className={`inline-block ${training.statusPendaftar === "Aktif" ? "text-green-500" : "text-orange-500"}`}>
                    {training.statusPendaftar}
                  </span>
                  <div className="text-sm mt-2">
                    <span>Pria: {training.pria}</span>
                    <br />
                    <span>Wanita: {training.wanita}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 border">{training.jurusan}</td>
              <td className="px-4 py-2 border">{training.email}</td>
              <td className="px-4 py-2 border">
                <a href="#" className="text-blue-500">Laporan</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>   
  );
}