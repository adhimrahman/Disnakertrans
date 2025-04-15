import Form from 'next/form';

export default function ContentsJobVacancyForm() {
  return (
    <Form action="" className="flex flex-col gap-y-6 p-6">
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Nama Lowongan Pekerjaan</p>
        <input
          title="Nama Lowongan"
          type="text"
          name="job-vacancy-name"
          placeholder="Nama Lowongan Di Sini"
          className="rounded-lg ring-2 ring-gray-300 text-black text-lg font-medium w-lg p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Foto Sampul Lowongan</p>
        <input
          type="file"
          name="activity-image-cover"
          className="rounded-md ring-1 ring-black text-black text-xs font-medium w-44 p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Deskripsi Lowongan</p>
        <input
          type="text"
          name="job-description"
          placeholder="Isi Deskripsi Pekerjaan Di Sini"
          className="rounded-md ring-2 ring-gray-300 text-black text-lg font-medium w-lg p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Range Gaji</p>
        <div className="flex flex-row gap-x-4 items-center">
          <input
            type="text"
            name="salary-range-min"
            placeholder="IDR"
            className="rounded-md ring-2 ring-gray-300 text-black text-lg font-medium w-2xs p-2 shadow-xl"
          />
          <p className='text-black text-2xl font-medium'> -- </p>
          <input
            type="text"
            name="salary-range-max"
            placeholder="IDR"
            className="rounded-md ring-2 ring-gray-300 text-black text-lg font-medium w-2xs p-2 shadow-xl"
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className='text-black text-xl font-medium'>Jenis Gaji</p>
        <div className='flex flex-row gap-x-2 items-center justify-between w-xl'>
          <div className='flex flex-row gap-x-2 w-28'>
            <p className='text-black text-lg font-medium'>Tetap</p>
            <input type="checkbox" name="gajiTetap" title="Tetap"/>
          </div>
          <div className='flex flex-row gap-x-2 w-28'>
            <p className='text-black text-lg font-medium'>Freelance</p>
            <input type="checkbox" name="gajiFreelance" title="Freelance"/>
          </div>
          <div className='flex flex-row gap-x-2 w-28'>
            <p className='text-black text-lg font-medium'>Kontrak</p>
            <input type="checkbox" name="gajiKontrak" title="Kontrak"/>
          </div>
          <div className='flex flex-row gap-x-2 w-28'>
            <p className='text-black text-lg font-medium'>Part Time</p>
            <input type="checkbox" name="gajiPartTime" title="PartTime"/>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Batas Lowongan</p>
        <input
          type="date"
          name="job-vacancy-expired-date"
          placeholder="Isi Tanggal Batas Lama Lowongan Di Sini"
          className="rounded-md ring-1 ring-black text-black text-lg font-medium w-44 p-2 shadow-xl"
        />
      </div>
      <div className='flex flex-col gap-y-2'>
        <p className='text-black text-xl font-medium'>Link Lowongan Pekerjaan</p>
        <input
          type="url"
          name="job-vacancy-link"
          placeholder="Link Lowongan Di Sini"
          className="rounded-md ring-2 ring-gray-300 text-black text-lg font-medium w-lg p-2 shadow-xl"
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