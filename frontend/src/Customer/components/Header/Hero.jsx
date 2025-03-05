import React from "react";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import HeroImg from "../../../assets/Hero.jpeg";

const Hero = () => {
  return (
    <div
      className="relative h-screen md:min-h-screen flex flex-col md:flex-row justify-center items-start md:justify-start md:items-center
     gap-10 px-6 md:px-28 py-10 md:py-20 overflow-hidden"
    >
      {/* Text Content */}
      <div className="text-center md:text-left z-10">
        <h3 className="text-2xl font-semibold my-20 text-orange-500 mb-4 animate-fade-in">
          Expensive but the best
        </h3>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in-up">
          Deliciousness jumping <br /> into the mouth
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto md:mx-0 animate-fade-in">
          Together creeping heaven upon third dominion be upon won't darkness
          rule land behold it created good saw after she'd Our set living. Signs
          midst dominion creepeth morning
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-orange-600 transition duration-300 shadow-lg">
            Reservation <FaArrowRight />
          </button>
          <button className="bg-white text-gray-800 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-100 transition duration-300 shadow-lg">
            <FaPlay className="text-orange-500" /> Watch our Story
          </button>
        </div>
      </div>

      {/* Image */}

      <img
        src={HeroImg}
        alt="Delicious Food"
        className="absolute -top-10 -right-80  md:-top-20 md:-right-80 w-[800px] h-[800px] rounded-[50px] -rotate-45 object-cover z-0"
      />

      {/* Background Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div> */}
    </div>
  );
};

export default Hero;
