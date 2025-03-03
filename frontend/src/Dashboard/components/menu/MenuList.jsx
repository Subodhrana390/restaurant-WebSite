import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const observer = useRef();
  const accessToken = localStorage.getItem("token");

  const fetchMenus = useCallback(async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/menu`, {
        params: { cursor, limit: 10 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { menuItems, hasMore: newHasMore } = res.data.data;

      setMenus((prevMenus) => [...prevMenus, ...menuItems]);
      setCursor(menuItems.length ? menuItems[menuItems.length - 1]._id : null);
      setHasMore(newHasMore);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore]);

  useEffect(() => {
    fetchMenus();
  }, []);

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

  const confirmDelete = (menu) => {
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!menuToDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/menu/${menuToDelete._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMenus(menus.filter((menu) => menu._id !== menuToDelete._id));
      toast.success("Menu item deleted successfully!");
    } catch (err) {
      toast.error("Access denied. Admins only.");
    } finally {
      setShowDeleteModal(false);
      setMenuToDelete(null);
    }
  };

  return (
    <div>
      <div className="backdrop-blur-md   bg-opacity-20 rounded-xl p-6 shadow-lg border border-blue-200 border-opacity-30">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Menu List</h1>
          <Link
            to="/admin/menu/add"
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300 shadow-md"
          >
            <FaPlus className="mr-2" /> Add New Dish
          </Link>
        </div>

        {menus.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-blue-800">No menu items found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead className=" text-white">
                <tr>
                  <th className="p-3 text-left rounded-tl-lg">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left hide-on-mobile">Discount</th>
                  <th className="p-3 text-left">Final Price</th>
                  <th className="p-3 text-left">Available</th>
                  <th className="p-3 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu, index) => (
                  <tr
                    key={menu._id}
                    ref={index === menus.length - 1 ? lastMenuRef : null}
                    className="border-t border-blue-200 hover:bg-blue-200 hover:bg-opacity-40 transition duration-150"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-200 mr-3 flex items-center justify-center text-blue-700 overflow-hidden border-2 border-blue-300">
                          {menu.image ? (
                            <img
                              src={`${
                                import.meta.env.VITE_IMAGE_BASE_URL
                              }/menu/${menu.image}`}
                              alt={menu.name || "Menu Image"}
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <span className="font-bold">
                              {menu.name?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white ">
                            {menu.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 capitalize text-white ">
                      {menu.category}
                    </td>
                    <td className="p-3 text-white ">₹ {menu.price}</td>
                    <td className="p-3 hide-on-mobile text-white ">
                      {menu.discount}%
                    </td>
                    <td className="p-3 font-medium text-white ">
                      ₹ {menu.finalPrice}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          menu.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {menu.isAvailable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end">
                      <Link
                        to={`/admin/menu/edit/${menu._id}`}
                        className="inline-block mr-2 p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white transition duration-200 shadow-sm"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => confirmDelete(menu)}
                        className="inline-block p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition duration-200 shadow-sm"
                        aria-label={`Delete ${menu.name}`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-70 backdrop-blur-lg p-6 rounded-xl shadow-xl max-w-sm w-full border border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-blue-700">
              Are you sure you want to delete{" "}
              <span className="font-bold">{menuToDelete?.name}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMenuToDelete(null);
                }}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;
