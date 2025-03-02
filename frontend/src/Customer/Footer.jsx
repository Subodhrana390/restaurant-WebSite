import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Us */}
        <div>
          <h3 className="text-xl font-bold mb-4">About Us</h3>
          <p className="text-gray-400">
            Heaven fruitful doesn't over for these the heaven fruitful does over
            days appear creeping seasons sad behold beari ath of it fly signs
            bearing be one blessed after.
          </p>
        </div>

        {/* Important Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Important Link</h3>
          <ul className="text-gray-400">
            <li className="mb-2">
              <a href="#" className="hover:text-orange-500 transition duration-300">
                WHMCS-bridge
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-orange-500 transition duration-300">
                Search Domain
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-orange-500 transition duration-300">
                My Account
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-orange-500 transition duration-300">
                Shopping Cart
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-orange-500 transition duration-300">
                Our Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition duration-300">
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-400 mb-2">
            Address: Hath of it fly signs bear be one blessed after
          </p>
          <p className="text-gray-400 mb-2">Phone: +2 36 265 (8060)</p>
          <p className="text-gray-400">Email: info@colorlib.com</p>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-4">Newsletter</h3>
          <p className="text-gray-400 mb-4">
            Heaven fruitful doesn't over lesser in days. Appear creeping seas
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-2 rounded-l-lg bg-gray-800 text-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 rounded-r-lg hover:bg-orange-600 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400">
          Copyright ©2025 All rights reserved | This template is made with ❤️ by{" "}
          <a
            href="https://colorlib.com"
            className="text-orange-500 hover:underline"
          >
            Colorlib
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;