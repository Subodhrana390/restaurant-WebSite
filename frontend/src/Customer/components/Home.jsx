import React, { useEffect } from "react";
import Hero from "./Header/Hero";
import ExclusiveMenu from "./ExclusiveMenu";
import OurHistory from "../OurHistory";
import FoodMenu from "./FoodMenu";
import Chefs from "../Chefs";
import Testimonials from "../Testimonials";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../redux/cartSlice";

const Home = () => {
  return (
    <div>
      <Hero />
      <OurHistory />
      <FoodMenu />
      <Chefs />
      <Testimonials />
    </div>
  );
};

export default Home;
