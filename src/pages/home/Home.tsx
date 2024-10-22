import { useEffect } from 'react';
const Home: React.FC = () => {
  useEffect(() => {
    const header = document.querySelector('header');
    const content = document.querySelector('.content-container');

    if (header && content) {
      const headerHeight = (header as HTMLElement).offsetHeight;
      (content as HTMLElement).style.marginTop = `${headerHeight}px`;
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 mt-14">
      {/* Hero Section */}
      <section className="bg-cover bg-center h-64 sm:h-80 lg:h-96" style={{ backgroundImage: `url('/image/superhero-themed background.webp')` }}>
        <div className="flex items-center justify-center h-full bg-black bg-opacity-40">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">Capture Your Memories</h2>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold text-gray-800">About DYB Personal Album</h2>
          <p className="mt-4 text-gray-600">Your personal album for organizing, storing, and sharing your favorite moments.</p>
        </div>
      </section>

      {/* Albums Section */}
      <section id="albums" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">Albums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {/* Example album cards */}
            <div className="relative img-container bg-white shadow-md rounded-lg overflow-hidden h-60">
              <img src="/image/Album1.JPG" 
                alt="Album 2" className="absolute inset-0 w-full h-full object-cover" />
              {/* <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col text-white bg-black bg-opacity-50">
                <h3 className="text-xl font-bold">Album 1</h3>
                <p className="text-gray-200">Description of Album 2</p>
              </div> */}
            </div>
            <div className="relative img-container bg-white shadow-md rounded-lg overflow-hidden h-60">
              <img src="/image/Album2.webp"
                alt="Album 2" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="relative img-container bg-white shadow-md rounded-lg overflow-hidden h-60">
              <img src="/image/Album3.JPG"
                alt="Album 3" className="absolute inset-0 w-full h-full object-cover" />
            </div>



            {/* Add more album cards here */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold text-gray-800">Contact Us</h2>
          <p className="mt-4 text-gray-600">Get in touch with us for more information.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 DYB Personal Album. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
