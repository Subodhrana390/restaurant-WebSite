import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUpload,
  FaHome,
  FaCity,
  FaGlobeAmericas,
  FaMapPin,
} from "react-icons/fa";
import { BiMap } from "react-icons/bi";
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    },
    profileImage: null,
  });

  const { name, email, password, confirmPassword, phone, role, address } =
    formData;

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword || !phone) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Create FormData object for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("phone", phone);
    formDataToSend.append("role", role);

    // Append address as a JSON string
    formDataToSend.append("address", JSON.stringify(address));

    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Signup successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      let errorMessage = "Signup failed. Please try again.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-black">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-black hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="backdrop-blur-lg bg-white/10 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="text-center">
              <div className="mt-2 flex flex-col items-center">
                <div className="relative w-32 h-32 overflow-hidden rounded-full mb-4 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-black/70" size={48} />
                  )}
                </div>
                <label
                  htmlFor="profile-upload"
                  className="relative cursor-pointer rounded-md font-medium text-black hover:text-blue-300 focus-within:outline-none"
                >
                  <span className="flex items-center space-x-2">
                    <FaUpload />
                    <span>Upload profile photo</span>
                  </span>
                  <input
                    id="profile-upload"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black"
                >
                  Full Name *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-black" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={handleChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black"
                >
                  Email address *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-black" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black"
                >
                  Password *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-black" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-black"
                >
                  Confirm Password *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-black" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={handleChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-black"
                >
                  Phone Number *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-black" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={handleChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>

            <div className="py-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-blue-900/20 backdrop-blur-sm text-sm text-black font-medium">
                    Address Information
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Street */}
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-black"
                >
                  Street Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHome className="text-black" />
                  </div>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-black"
                >
                  City
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCity className="text-black" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New York"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-black"
                >
                  State/Province
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BiMap className="text-black" />
                  </div>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="NY"
                  />
                </div>
              </div>

              {/* Pin Code */}
              <div>
                <label
                  htmlFor="pinCode"
                  className="block text-sm font-medium text-black"
                >
                  Postal/ZIP Code
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapPin className="text-black" />
                  </div>
                  <input
                    id="pinCode"
                    name="pinCode"
                    type="text"
                    value={address.pinCode}
                    onChange={handleAddressChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10001"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="md:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-black"
                >
                  Country
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobeAmericas className="text-black" />
                  </div>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="pl-10 block w-full py-2 px-3 border border-white/30 bg-white/5 backdrop-blur-sm rounded-md leading-5 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating Account..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
