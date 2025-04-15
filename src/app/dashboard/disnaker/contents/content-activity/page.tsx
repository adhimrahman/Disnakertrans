import Form from 'next/form';

export default function ContentsActivityForm() {
  return (
    <Form action="" className="flex flex-col gap-y-6 p-6">
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Nama Kegiatan</p>
        <input
          title="Nama Kegiatan"
          type="text"
          name="activity-name"
          placeholder="Contoh: Kegiatan Pengabdian Masyarakat"
          className="rounded-lg ring-2 ring-gray-300 text-black text-lg font-medium w-lg p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Sampul Kegiatan</p>
        <input
          type="file"
          name="activity-image-cover"
          className="rounded-md ring-1 ring-black text-black text-xs font-medium w-44 p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Deskripsi Kegiatan</p>
        <input
          type="text"
          name="activity-description"
          placeholder="Isi Deskripsi Kegiatan Di Sini"
          className="rounded-md ring-2 ring-gray-300 text-black text-lg font-medium w-lg p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Tanggal Upload</p>
        <input
          type="date"
          name="uploaded-time"
          placeholder="Isi Tanggal Diupload-nya konten "
          className="rounded-md ring-1 ring-black text-black text-lg font-medium w-44 p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Dokumentasi Kegiatan</p>
        <input
          type="file"
          name="activity-documentation"
          placeholder="Upload Dokumentasi Kegiatan Di Sini"
          className="rounded-md border border-black text-black text-xs font-medium w-44 p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-row gap-x-4 justify-between w-sm mt-12'>
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
          Reset
        </button>
      </div>
    </Form>
  );
}