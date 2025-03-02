import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Chefs = () => {
  return (
    <div className="py-16 px-6">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h5 className="text-lg font-semibold text-orange-500">Team Member</h5>
        <h1 className="text-4xl font-bold text-gray-800 mt-2">
          Our Experience Chefs
        </h1>
      </div>

      {/* Chefs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Chef Card 1 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <img
            src="https://preview.colorlib.com/theme/dingo/img/team/chefs_1.png"
            alt="Adam Billiard"
            className="w-full h-64 object-cover"
          />
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Adam Billiard</h1>
            <p className="text-gray-600 mt-2">Chef Master</p>
            <div className="flex justify-center mt-4 space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Chef Card 2 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <img
            src="https://preview.colorlib.com/theme/dingo/img/team/chefs_2.png"
            alt="Fred Macyard"
            className="w-full h-64 object-cover"
          />
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Fred Macyard</h1>
            <p className="text-gray-600 mt-2">Chef Master</p>
            <div className="flex justify-center mt-4 space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Chef Card 3 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <img
            src="https://preview.colorlib.com/theme/dingo/img/team/chefs_3.png"
            alt="Justin Stuard"
            className="w-full h-64 object-cover"
          />
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Justin Stuard</h1>
            <p className="text-gray-600 mt-2">Chef Master</p>
            <div className="flex justify-center mt-4 space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chefs;