import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const observer = useRef();
  const navigate = useNavigate();

  // Function to fetch menu items with cursor pagination
  const fetchMenus = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/menu`,
          {
            params: {
              cursor: reset ? null : cursor,
              limit: 10,
              category: selectedCategory === "All" ? null : selectedCategory,
            },
          }
        );

        const { menuItems, hasMore: newHasMore } = res.data.data;

        setMenus((prevMenus) => {
          if (reset) return menuItems; // Reset list if category changes
          const uniqueItems = menuItems.filter(
            (item) =>
              !prevMenus.some((existingItem) => existingItem._id === item._id)
          );
          return [...prevMenus, ...uniqueItems];
        });

        setCursor(
          menuItems.length ? menuItems[menuItems.length - 1]._id : null
        );
        setHasMore(newHasMore);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [cursor, hasMore, selectedCategory]
  );

  // Fetch data on component mount or category change
  useEffect(() => {
    fetchMenus(true); // Reset when category changes
  }, [selectedCategory]);

  // Intersection Observer for Infinite Scrolling
  const lastMenuRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMenus();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMenus]
  );

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Check Our Yummy Menu
        </h1>

        {/* Menu Categories */}
        <ul className="flex justify-center space-x-8 mb-12 flex-wrap">
          {[
            "All",
            "starter",
            "main course",
            "dessert",
            "beverage",
            "side dish",
          ].map((category) => (
            <li
              key={category}
              className={`text-lg font-semibold text-gray-600 hover:text-orange-500 cursor-pointer transition-all duration-300 ${
                selectedCategory === category
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : ""
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setCursor(null); // Reset cursor on category change
                setHasMore(true);
              }}
            >
              {category.toUpperCase()}
            </li>
          ))}
        </ul>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menus.map((item, index) => (
            <div
              key={item._id}
              ref={index === menus.length - 1 ? lastMenuRef : null}
              className="bg-white p-6 transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate(`/menu/${item._id}`)}
            >
              <img
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}/menu/${
                  item.image
                }`}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {item.name}
              </h2>
              <p className="text-gray-600 mb-2">
                {item.ingredients.join(", ")}
              </p>
              <p className="text-orange-500 font-bold">₹ {item.price}</p>
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && <p className="text-gray-500 mt-4">Loading more items...</p>}
      </div>
    </section>
  );
};

export default Menu;
