import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";

function EditUser() {
    const serverApi = import.meta.env.VITE_SERVER_API;
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isAdmin: false
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverApi}/auth/getOneUser/${id}`);
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
          isAdmin: res.data.user.isAdmin
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${serverApi}/auth/updateUserProfile/${id}`, {
        name: formData.name,
        email: formData.email
      });
      navigate("/admin/users");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-900"
        >
          <FiArrowLeft /> Back to Users
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Edit User</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-lg">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              disabled={formData.email === "bstech500@gmail.com"} // Prevent changing admin status for main admin
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
              Administrator
            </label>
          </div>

          {formData.email === "bstech500@gmail.com" && (
            <p className="text-sm text-gray-500">
              This is the primary admin account and cannot be modified.
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md flex items-center gap-2 transition-colors"
              disabled={loading || formData.email === "bstech500@gmail.com"}
            >
              <FiSave /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditUser;