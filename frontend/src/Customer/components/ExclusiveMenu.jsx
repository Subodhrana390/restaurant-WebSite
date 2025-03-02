import React, { useState } from "react";
import { FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Exc from "../../assets/Exc.jpg";

const ExclusiveMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Simulate loading state

  // Sample menu items data
  const menuItems = [
    {
      id: 1,
      name: "Indian Burger",
      description: "Was brean shed moveth day yielding tree yielding day were female and",
      price: "$12.99",
      image: Exc,
      rating: 4.5,
      isBestSeller: true,
    },
    {
      id: 2,
      name: "Spicy Pizza",
      description: "A delicious pizza with a spicy twist.",
      price: "$15.99",
      image: Exc,
      rating: 4.7,
      isBestSeller: false,
    },
    {
      id: 3,
      name: "Chocolate Dessert",
      description: "Rich and creamy chocolate dessert.",
      price: "$8.99",
      image: Exc,
      rating: 4.9,
      isBestSeller: true,
    },
  ];

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="py-16 px-6 md:px-28">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Popular Dishes</h1>
        <p className="text-lg text-gray-600">Our Exclusive Items</p>
      </div>

      {/* Filter/Category Section */}
      <div className="flex justify-center gap-4 mb-12">
        <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300">
          Burgers
        </button>
        <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition duration-300">
          Pizzas
        </button>
        <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition duration-300">
          Desserts
        </button>
      </div>

      {/* Menu Items Carousel */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Slider {...settings}>
          {menuItems.map((item) => (
            <div key={item.id} className="px-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-fade-in">
                {/* Best Seller Badge */}
                {item.isBestSeller && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    Best Seller
                  </div>
                )}

                {/* Image with Hover Effect */}
                <div className="relative overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300 flex items-center gap-2 text-sm">
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      className="bg-white text-gray-800 px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300 text-sm"
                    >
                      View Details
                    </button>
                    <button className="text-gray-500 hover:text-red-500 transition duration-300">
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {/* Quick View Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedItem.name}</h2>
            <p className="text-gray-600 mb-4">{selectedItem.description}</p>
            <p className="text-lg font-bold text-orange-500 mb-4">{selectedItem.price}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExclusiveMenu;