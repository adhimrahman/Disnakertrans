export default function AboutSection() {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tentang Kami
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...
            </p>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
            <img
              src="/images/kami.jpg"
              alt="About Us Illustration"
              className="w-full max-w-md rounded-3xl lg:max-w-lg"
            />
          </div>
        </div>
      </section>
    );
  }
  