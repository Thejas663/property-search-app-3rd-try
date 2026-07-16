import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaCalendarAlt, FaSignOutAlt, FaBuilding, FaEdit, FaTrash } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    city: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    parkings: "",
    image: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMyProperties = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/properties/my-properties", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setMyProperties(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load user properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const currentUser = localStorage.getItem("currentUser");

    if (!loggedIn || !currentUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(currentUser));
      fetchMyProperties();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/properties/property/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setMyProperties(myProperties.filter((p) => p.id !== id));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete property");
      }
    } catch (err) {
      alert("Error deleting property");
    }
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title,
      city: property.city,
      description: property.description,
      price: property.price,
      bedrooms: property.facilities?.bedrooms ?? property.bedrooms ?? 0,
      bathrooms: property.facilities?.bathrooms ?? property.bathrooms ?? 0,
      parkings: property.facilities?.parkings ?? property.parkings ?? 0,
      image: property.image || ""
    });
    setError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/properties/property/${editingProperty.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editForm,
          price: parseFloat(editForm.price),
          bedrooms: parseInt(editForm.bedrooms, 10),
          bathrooms: parseInt(editForm.bathrooms, 10),
          parkings: parseInt(editForm.parkings, 10)
        })
      });

      const data = await response.json();
      if (response.ok) {
        // Refresh properties list
        fetchMyProperties();
        setEditingProperty(null);
      } else {
        setError(data.message || "Failed to update property");
      }
    } catch (err) {
      setError("Error updating property");
    }
  };

  if (!user) {
    return (
      <div className="flexCenter min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] bg-gradient-to-r from-primary via-white to-white min-h-screen pt-28 pb-16">
      <div className="max-padd-container">
        {/* Banner */}
        <div className="relative h-48 w-full bg-gradient-to-r from-tertiary to-secondary rounded-3xl overflow-hidden shadow-lg mb-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute -bottom-10 left-8 sm:left-12 flex items-end gap-x-4">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-white flexCenter shadow-md overflow-hidden text-slate-800">
              <LuUserRound className="text-5xl text-gray-300" />
            </div>
            <div className="mb-12 text-white">
              <h1 className="h3 mb-0 text-white font-bold">{user.name}</h1>
              <p className="text-white/80 medium-14">Premium Member</p>
            </div>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Details Card */}
          <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-fit">
            <div>
              <h3 className="h3 border-b pb-3 mb-6">Profile Details</h3>
              <div className="flex flex-col gap-y-5">
                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 bg-primary rounded-full flexCenter text-secondary">
                    <LuUserRound />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Full Name</span>
                    <span className="medium-15 text-tertiary">{user.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 bg-primary rounded-full flexCenter text-secondary">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Email Address</span>
                    <span className="medium-15 text-tertiary">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 bg-primary rounded-full flexCenter text-secondary">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Member Since</span>
                    <span className="medium-15 text-tertiary">July 2026</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 btn-dark w-full flexCenter gap-x-2 py-3 rounded-xl hover:bg-secondary transition-all duration-300"
            >
              <FaSignOutAlt />
              Logout Account
            </button>
          </div>

          {/* Activity / Listings Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="h3 border-b pb-3 mb-6">Your Listings</h3>
            
            {loading ? (
              <div className="flexCenter py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : myProperties.length === 0 ? (
              <div className="flexCenter flex-col py-12 text-center">
                <div className="h-16 w-16 bg-primary text-secondary rounded-full flexCenter text-3xl mb-4">
                  <FaBuilding />
                </div>
                <h4 className="h4 text-tertiary">No properties listed yet</h4>
                <p className="max-w-xs text-gray-400 mt-2 mb-6">
                  Start listing your real estate properties and reach thousands of buyers effortlessly.
                </p>
                <button
                  onClick={() => navigate("/add-property")}
                  className="btn-secondary rounded-xl py-2 px-6 shadow-sm hover:scale-105 transition-all duration-300"
                >
                  Add Your First Property
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-y-4">
                {myProperties.map((property) => (
                  <div key={property.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-2xl gap-4 hover:shadow-md transition duration-300">
                    <div className="flex items-center gap-x-4">
                      {property.image && (
                        <img src={property.image} alt={property.title} className="h-16 w-16 object-cover rounded-xl" />
                      )}
                      <div>
                        <h4 className="bold-16 text-tertiary">{property.title}</h4>
                        <p className="text-gray-400 text-xs">{property.city} • ${property.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleEditClick(property)}
                        className="flex-1 sm:flex-initial btn-outline flexCenter gap-x-2 py-1.5 px-3 rounded-lg border border-slate-200 text-tertiary"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="flex-1 sm:flex-initial flexCenter gap-x-2 py-1.5 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition duration-300"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flexCenter p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="h3 border-b pb-3 mb-6">Edit Property</h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="border p-2 rounded-xl"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                className="border p-2 rounded-xl"
                required
              />
              <textarea
                placeholder="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="border p-2 rounded-xl"
                rows={3}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className="border p-2 rounded-xl"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Bedrooms"
                  value={editForm.bedrooms}
                  onChange={(e) => setEditForm({ ...editForm, bedrooms: e.target.value })}
                  className="border p-2 rounded-xl"
                  required
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Bathrooms"
                  value={editForm.bathrooms}
                  onChange={(e) => setEditForm({ ...editForm, bathrooms: e.target.value })}
                  className="border p-2 rounded-xl"
                  required
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Parkings"
                  value={editForm.parkings}
                  onChange={(e) => setEditForm({ ...editForm, parkings: e.target.value })}
                  className="border p-2 rounded-xl"
                  required
                  min="0"
                />
              </div>
              <input
                type="text"
                placeholder="Image URL"
                value={editForm.image}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                className="border p-2 rounded-xl"
              />
              <div className="flex gap-x-2 mt-4">
                <button type="submit" className="flex-1 btn-secondary py-2.5 rounded-xl">Save Changes</button>
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="flex-1 py-2.5 border rounded-xl text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
