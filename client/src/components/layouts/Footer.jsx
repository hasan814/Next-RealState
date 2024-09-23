const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Real Estate</h3>
            <p className="text-gray-400">
              We provide the best real estate services to help you find your
              dream home. Whether you are looking to buy, rent, or sell, we’ve
              got you covered.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-gray-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/properties" className="hover:text-gray-300">
                  Properties
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="/search" className="hover:text-gray-300">
                  Search Listings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="block">Email: info@realestate.com</span>
              </li>
              <li>
                <span className="block">Phone: +1 123-456-7890</span>
              </li>
              <li>
                <span className="block">
                  Address: 123 Real Estate St., City, Country
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    className="w-6 h-6"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/icons/twitter.svg"
                    alt="Twitter"
                    className="w-6 h-6"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/icons/instagram.svg"
                    alt="Instagram"
                    className="w-6 h-6"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/icons/linkedin.svg"
                    alt="LinkedIn"
                    className="w-6 h-6"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
