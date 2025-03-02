import React from "react";
import {
  FaUtensils,
  FaLeaf,
  FaFire,
  FaHeart,
  FaSmile,
} from "react-icons/fa";

const Second = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-8 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section - Content */}
        <div className="space-y-8">
          <p className="text-lg text-yellow-600 font-semibold">
            Discover Culinary Excellence
          </p>
          <h1 className="text-4xl font-bold text-gray-900">
            Serving Fresh, Delicious Meals for Your Family!
          </h1>
          <p className="text-gray-600">
            At our restaurant, we believe in using only the freshest ingredients
            to create meals that bring people together. From farm-to-table
            produce to expertly crafted dishes, every bite is a celebration of
            flavor and tradition.
          </p>

          {/* Icons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Icon 1 - Fresh Ingredients */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaLeaf className="text-2xl text-yellow-600" />
              </div>
              <span className="text-gray-600">
                Fresh, locally-sourced ingredients for every dish.
              </span>
            </div>

            {/* Icon 2 - Expertly Prepared */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaUtensils className="text-2xl text-yellow-600" />
              </div>
              <span className="text-gray-600">
                Expertly prepared meals by our talented chefs.
              </span>
            </div>

            {/* Icon 3 - Family-Friendly */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaHeart className="text-2xl text-yellow-600" />
              </div>
              <span className="text-gray-600">
                A warm, family-friendly atmosphere for everyone.
              </span>
            </div>

            {/* Icon 4 - Signature Dishes */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaFire className="text-2xl text-yellow-600" />
              </div>
              <span className="text-gray-600">
                Signature dishes that ignite your taste buds.
              </span>
            </div>

            {/* Icon 5 - Exceptional Service */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaSmile className="text-2xl text-yellow-600" />
              </div>
              <span className="text-gray-600">
                Exceptional service to make every visit memorable.
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex items-center justify-center">
          <img
            className="rounded-lg shadow-lg"
            src="https://preview.colorlib.com/theme/allfood/assets/img/gallery/about.png"
            alt="Family Dining at Our Restaurant"
          />
        </div>
      </div>
    </div>
  );
};

export default Second;