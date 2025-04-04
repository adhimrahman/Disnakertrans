import React from 'react'

export default function NarrativeSection() {
  return (
    <section className=" text-white py-16" style={{ backgroundColor: "#3561A1" }}>
    <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 flex justify-center">
        <img src="/images/Job2.png" alt="w-full max-w-md lg:max-w-lg" /></div>
        <div className="lg:w-1/2 mt-10 lg:mt-0">
        <h2 className="text-3xl lg:text-4xl font-bold">Dinas Ketenagakerjaan dan Transmigrasi Gowa</h2>
        <p className="text-lg mt-4 leading-relaxed">
            Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
        </div>
    </div>
  </section>
  )
}
