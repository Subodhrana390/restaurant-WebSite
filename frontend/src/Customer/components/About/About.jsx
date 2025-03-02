import React from "react";
import { FaBeer, FaCheese, FaWineGlassAlt } from "react-icons/fa";
import Second from "./second";
import Services from "./Services";

const About = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 h-[500px] md:h-[600px]">
              <img
                className="w-full h-full object-cover rounded-md md:rounded-l-2xl md:rounded-r-none"
                src="https://preview.colorlib.com/theme/allfood/assets/img/gallery/about2.png"
                alt="Brew Master Restaurant"
              />
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="flex items-center space-x-2 text-orange-600">
                <FaBeer className="text-2xl" />
                <span className="uppercase tracking-wide text-sm font-semibold">
                  About Brew Master
                </span>
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Crafting the Finest Brews for Your Family!
              </h1>
              <p className="mt-4 text-gray-600 text-justify leading-relaxed">
                At Brew Master, we believe in the art of brewing. Our passion
                for crafting the finest beers is matched only by our commitment
                to quality and tradition. Whether you're a fan of hoppy IPAs,
                rich stouts, or refreshing lagers, we have something special for
                every palate. Join us in our journey as we explore the depths of
                flavor and the heights of brewing excellence.
              </p>

              {/* Icons Section */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <FaBeer className="text-4xl text-orange-600 mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">Craft Beers</p>
                </div>
                <div className="p-4">
                  <FaCheese className="text-4xl text-orange-600 mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">Gourmet Food</p>
                </div>
                <div className="p-4">
                  <FaWineGlassAlt className="text-4xl text-orange-600 mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">Fine Wines</p>
                </div>
              </div>

              {/* Button */}
              <div className="mt-8">
                <button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Second />
      <Services />
    </>
  );
};

export default About;
