import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner"; // using Sonner toast
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Navbar from "../shared/Navbar";

const ManageRecruiter = () => {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [creating, setCreating] = useState(false);

  const API_BASE = "/api/v1/user/admin/recruiter";

  // Fetch current recruiter
  const fetchRecruiter = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE, { withCredentials: true });
      if (res.data.recruiter) setRecruiter(res.data.recruiter);
      else setRecruiter(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch recruiter");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiter();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create recruiter
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axios.post(API_BASE, formData, { withCredentials: true });
      toast.success(res.data.message);
      setFormData({ fullname: "", email: "", phoneNumber: "", password: "" });
      fetchRecruiter();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create recruiter");
    } finally {
      setCreating(false);
    }
  };

  // Remove recruiter
  const handleRemove = async () => {
    if (!recruiter) return;
    if (!window.confirm(`Are you sure you want to remove ${recruiter.fullname}?`)) return;

    try {
      const res = await axios.delete(`${API_BASE}/${recruiter._id}`, { withCredentials: true });
      toast.success(res.data.message);
      setRecruiter(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove recruiter");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading recruiter...</p>;

  return (
    <div>
        <Navbar/>
    
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Recruiter</h1>
</div>
      {recruiter ? (
        <div className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center mb-8">
          <div>
            <p className="text-xl font-semibold">{recruiter.fullname}</p>
            <p className="text-gray-600">{recruiter.email}</p>
            <p className="text-gray-600">{recruiter.phoneNumber}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full">
              Active Recruiter
            </span>
          </div>
          <Button
            variant="destructive"
            onClick={handleRemove}
            className="ml-4"
          >
            Remove Recruiter
          </Button>
        </div>
      ) : (
        <p className="mb-6 text-gray-700">
          No active recruiter found. You can create one below.
        </p>
      )}

      {/* Only show form if no recruiter exists */}
      {!recruiter && (
        <form
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
          onSubmit={handleCreate}
        >
          <h2 className="text-2xl font-semibold mb-4">Create Recruiter</h2>

          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              name="fullname"
              placeholder="John Doe"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="9801234567"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Recruiter"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ManageRecruiter;