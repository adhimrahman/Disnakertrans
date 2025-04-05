import React from 'react'

export default function ContactHighlight() {
  return (
    <section className="py-16 text-white" style={{ backgroundColor: "#3561A1" }}>
    <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/3 flex justify-center space-x-6">
            <img 
            src="/images/Garuda.png" 
            alt="Garuda Logo"
            className="w-28 h-28 object-contain" />
            <img 
            src="/images/Logo.png" 
            alt="Logo Gowa"
            className="w-28 h-28 object-contain" />
        </div>

        <div className="lg:w-2/3 mt-10 lg:mt-0 text-left">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-center">Contact Us</h2>
            <p className="text-lg leading-relaxed">
                Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="mt-6 flex justify-center w-full">
                <a href="contact-us/">
                <button className="bg-red-500 cursor-pointer text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition">
                    Contact Us
                </button>
                </a>
            </div>
        </div>

    </div>
  </section>
  )
}
