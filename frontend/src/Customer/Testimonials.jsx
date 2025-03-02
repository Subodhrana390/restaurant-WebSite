import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonialsData = [
  {
    img: "https://preview.colorlib.com/theme/dingo/img/client/client_1.png",
    name: "Mosan Caren",
    position: "Executive of Fedox",
    feedback: "Great experience! Loved the service and food quality.",
  },
  {
    img: "https://preview.colorlib.com/theme/dingo/img/client/client_1.png",
    name: "John Doe",
    position: "CEO of TechCorp",
    feedback: "Excellent customer support and quick service.",
  },
  {
    img: "https://preview.colorlib.com/theme/dingo/img/client/client_1.png",
    name: "Sarah Lee",
    position: "Marketing Head at XYZ",
    feedback: "The ambiance was fantastic, highly recommend!",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
      <h2 className="text-lg text-gray-500 mb-6">Customers Feedback</h2>

      <Slider {...settings} className="w-3/4 mx-auto">
        {testimonialsData.map((testimonial, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md flex ">
            <img
              src={testimonial.img}
              alt={testimonial.name}
              className="mx-auto w-24 h-24 rounded-full mb-4"
            />
            <hr className="my-4 w-16 mx-auto border-gray-300" />
            <p className="italic text-gray-600">{testimonial.feedback}</p>
            <div className="mt-4">
              <h3 className="font-bold">{testimonial.name}</h3>
              <span className="text-sm text-gray-500">{testimonial.position}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
