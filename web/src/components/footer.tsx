import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white py-12 px-4 md:px-8 lg:px-12 border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col space-y-4">
            <div className="items-center">
              <div className="text-xl font-bold">FRESH</div>
              <div className="text-3xl font-bold flex">
                <p className="text-[#d1d1d1]">F</p>
                <p className="text-[#ECB365]">A</p>
                <p className="text-[#74959A]">R</p>
                <p className="text-[#d1d1d1]">M</p>
              </div>
            </div>
          </div>

          {/* Sitemap Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Sitemap</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/home" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link
                href="/function"
                className="text-gray-600 hover:text-gray-900"
              >
                Function
              </Link>
              <Link href="/chat" className="text-gray-600 hover:text-gray-900">
                Chat
              </Link>
              <Link
                href="/history"
                className="text-gray-600 hover:text-gray-900"
              >
                History
              </Link>
            </nav>
          </div>

          {/* Socials Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Socials</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="https://facebook.com"
                className="text-gray-600 hover:text-gray-900"
              >
                Facebook
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-gray-600 hover:text-gray-900"
              >
                Linkedin
              </Link>
              <Link
                href="https://instagram.com"
                className="text-gray-600 hover:text-gray-900"
              >
                Instagram
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-600 hover:text-gray-900"
              >
                Twitter
              </Link>
            </nav>
          </div>

          {/* Head Office & Newsletter Section */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Head Office</h3>
              <p className="text-gray-600">
                BH-B6, Ho Chi Minh City University of Technology - VNU, Dong
                Hoa, Di An, Binh Duong
              </p>
            </div>

            {/* <div className="space-y-2">
              <h3 className="text-lg font-semibold">News letter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-white p-2 border border-l-0 border-gray-300">
                  <Mail className="h-5 w-5 text-blue-500" />
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Contact & Copyright */}
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0">
            <a href="mailto:contact@root.com" className="hover:text-gray-900">
              contact@freshfarm.com
            </a>
          </div>
          <div className="text-gray-600 mb-4 md:mb-0">
            <a href="tel:+919845227376" className="hover:text-gray-900">
              +84 12356789
            </a>
          </div>
          <div className="text-gray-600 text-sm">
            © 2025 Fresh Farm All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
