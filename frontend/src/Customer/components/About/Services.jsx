import React from "react";
import {FaPepperHot, FaConciergeBell } from "react-icons/fa";
import { TbChefHat } from "react-icons/tb"

const services = [
  {
    id: 1,
    title: "Best Chefs",
    icon: <TbChefHat className="text-orange-500 text-6xl mb-4" />,
    description:
      "Our highly skilled chefs bring years of experience to craft mouthwatering dishes with the finest ingredients.",
  },
  {
    id: 2,
    title: "Fresh & Quality Food",
    icon: <FaPepperHot className="text-red-500 text-6xl mb-4" />,
    description:
      "We ensure that every meal is prepared using fresh, locally sourced ingredients to provide the best flavors.",
  },
  {
    id: 3,
    title: "Exceptional Service",
    icon: <FaConciergeBell className="text-blue-500 text-6xl mb-4" />,
    description:
      "Our friendly staff is dedicated to providing top-notch hospitality, ensuring a delightful dining experience.",
  },
];

const Services = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-8 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Services We Offer
        </h2>
        <p className="text-lg text-gray-600 mb-16">
          Experience the Best of Fine Dining with Our Exceptional Services
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-transparent"
            >
              <div className="hover:animate-bounce">{service.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;