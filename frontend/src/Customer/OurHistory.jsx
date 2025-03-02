import React from "react";

const OurHistory = () => {
  return (
    <div className="relative py-20 px-6 bg-white overflow-hidden">
      {/* Container */}
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* Image Section */}
        <div className="flex-1 animate-fade-in">
          <div className="relative group">
            <img
              src="https://preview.colorlib.com/theme/dingo/img/about.png"
              alt="Our History"
              className="w-full transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Text Content Section */}
        <div className="flex-1 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Our <span className="text-orange-500">History</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Where The Food’s As Good As The Root Beer.
          </p>
          <p className="text-gray-600 mb-8">
            Satisfying people hunger for simple pleasures. May over was. Be
            signs two. Spirit. Brought said dry own firmament lesser best sixth
            deep abundantly bearing, him, gathering you blessed bearing he our
            position best ticket in month hole deep.
          </p>
          <button className="bg-orange-500 text-white px-8 py-4 rounded-full hover:bg-orange-600 transition duration-300 flex items-center gap-2 group">
            <span>Read More</span>
            <svg
              className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OurHistory;
