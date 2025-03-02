import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    shift: "",
    status: "",
    salary: 0,
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    },
    profileImage: null,
  });

  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // API base URL - centralized for consistency
  const API_BASE_URL = "http://localhost:5000/api/v1/employee";

  // Fetch profile data
  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE_URL}/profile`)
      .then((res) => {
        setProfile(res.data.data);
        setUpdatedProfile(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic image validation
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);
      setError(null);
    }
  };

  // Handle profile update
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);

    const formData = new FormData();
    formData.append("phone", updatedProfile.phone);
    formData.append("street", updatedProfile.address.street);
    formData.append("city", updatedProfile.address.city);
    formData.append("state", updatedProfile.address.state);
    formData.append("pinCode", updatedProfile.address.pinCode);
    formData.append("country", updatedProfile.address.country);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/update-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.data || res.data);
      setUpdatedProfile(res.data.data || res.data);
      setEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing - reset form
  const handleCancel = () => {
    setUpdatedProfile(profile);
    setProfileImage(null);
    setEditing(false);
    setError(null);
  };

  if (loading && !profile.name) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-24 w-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto mb-2"></div>
        </div>
        <p className="mt-4">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-transparent text-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {error && (
        <div className="bg-red-800 text-white p-3 rounded mb-4">{error}</div>
      )}

      {updateSuccess && (
        <div className="bg-green-700 text-white p-3 rounded mb-4">
          Profile updated successfully!
        </div>
      )}

      <div className="flex items-center gap-4">
        <img
          src={
            profile.profileImage
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}/employee/${
                  profile.profileImage
                }`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full border border-gray-500 object-cover"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        {editing && (
          <div className="flex flex-col">
            <input
              type="file"
              onChange={handleImageChange}
              className="text-sm"
              accept="image/jpeg,image/png,image/gif"
            />
            <small className="text-gray-400 mt-1">
              Max size: 5MB. Formats: JPEG, PNG, GIF
            </small>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-gray-400">Name:</label>
          <p className="font-medium">{profile.name}</p>
        </div>

        <div>
          <label className="block text-gray-400">Email:</label>
          <p className="font-medium">{profile.email}</p>
        </div>

        <div>
          <label className="block text-gray-400">Role:</label>
          <p className="font-medium">{profile.role}</p>
        </div>

        <div>
          <label className="block text-gray-400">Phone:</label>
          {editing ? (
            <input
              type="tel"
              name="phone"
              value={updatedProfile.phone}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 w-full"
              placeholder="Enter phone number"
            />
          ) : (
            <p className="font-medium">{profile.phone || "Not provided"}</p>
          )}
        </div>

        {profile.shift && (
          <div>
            <label className="block text-gray-400">Shift:</label>
            <p className="font-medium">{profile.shift}</p>
          </div>
        )}

        {profile.status && (
          <div>
            <label className="block text-gray-400">Status:</label>
            <p className="font-medium">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  profile.status.toLowerCase() === "active"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></span>
              {profile.status}
            </p>
          </div>
        )}

        {/* {profile.salary > 0 && (
          <div>
            <label className="block text-gray-400">Salary:</label>
            <p className="font-medium">${profile.salary.toLocaleString()}</p>
          </div>
        )} */}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-3">
          Address
        </h3>
        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={updatedProfile.address.street}
                onChange={handleAddressChange}
                className="p-2 rounded bg-gray-700 w-full"
              />
            </div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={updatedProfile.address.city}
              onChange={handleAddressChange}
              className="p-2 rounded bg-gray-700 w-full"
            />
            <input
              type="text"
              name="state"
              placeholder="State/Province"
              value={updatedProfile.address.state}
              onChange={handleAddressChange}
              className="p-2 rounded bg-gray-700 w-full"
            />
            <input
              type="text"
              name="pinCode"
              placeholder="Postal/Zip Code"
              value={updatedProfile.address.pinCode}
              onChange={handleAddressChange}
              className="p-2 rounded bg-gray-700 w-full"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={updatedProfile.address.country}
              onChange={handleAddressChange}
              className="p-2 rounded bg-gray-700 w-full"
            />
          </div>
        ) : (
          <p className="text-gray-300">
            {profile.address.street ? (
              <>
                {profile.address.street}, {profile.address.city},{" "}
                {profile.address.state}, {profile.address.pinCode},{" "}
                {profile.address.country}
              </>
            ) : (
              "No address information provided"
            )}
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {editing ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className={`px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
