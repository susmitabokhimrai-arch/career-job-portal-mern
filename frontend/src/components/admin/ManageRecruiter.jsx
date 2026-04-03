import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Trash, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import Navbar from "../shared/Navbar";

const ManageRecruiter = () => {
  const { user } = useSelector((state) => state.auth);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // Fetch all recruiters
  const fetchRecruiters = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/admin/recruiters`, {
        withCredentials: true,
      });
      setRecruiters(res.data.recruiters);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch recruiters");
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  // Add recruiter
  const handleAddRecruiter = async (e) => {
    e.preventDefault();
    if (!fullname || !email || !phoneNumber || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/admin/recruiters`,
        { fullname, email, phoneNumber, password },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      setFullname("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");

      fetchRecruiters();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add recruiter");
    }
    setLoading(false);
  };

  // Delete recruiter
  const handleDeleteRecruiter = async (recruiterId) => {
    if (!window.confirm("Are you sure you want to remove this recruiter?")) return;

    try {
      const res = await axios.delete(
        `${USER_API_END_POINT}/admin/recruiters/${recruiterId}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      fetchRecruiters();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove recruiter");
    }
  };

  return (
    <div>
  <Navbar />

  <div className="p-6 space-y-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
    <h1 className="text-3xl font-bold text-blue-700">Manage Recruiters</h1>

    {/* Add Recruiter Form */}
    <form
      className="p-6 border rounded-lg shadow-lg bg-white space-y-4"
      onSubmit={handleAddRecruiter}
    >
      <h2 className="font-semibold text-lg flex items-center gap-2 text-blue-600">
        <UserPlus size={20} /> Add Recruiter
      </h2>

      <div className="flex flex-col">
        <Label className="text-blue-700">Full Name</Label>
        <Input
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Full Name"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <Label className="text-blue-700">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <Label className="text-blue-700">Phone Number</Label>
        <Input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <Label className="text-blue-700">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
      >
        {loading ? "Adding..." : "Add Recruiter"}
      </Button>
    </form>

    {/* Recruiter List */}
    <div className="p-6 border rounded-lg shadow-lg bg-white space-y-2">
      <h2 className="font-semibold text-lg text-blue-600">
        All Recruiters ({recruiters.length})
      </h2>
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-blue-100 border-b">
            <th className="px-4 py-2 text-blue-700">Name</th>
            <th className="px-4 py-2 text-blue-700">Email</th>
            <th className="px-4 py-2 text-blue-700">Phone</th>
            <th className="px-4 py-2 text-blue-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((r, index) => (
            <tr
              key={r._id}
              className={`border-b ${
                index % 2 === 0 ? "bg-blue-50" : "bg-white"
              }`}
            >
              <td className="px-4 py-2">{r.fullname}</td>
              <td className="px-4 py-2">{r.email}</td>
              <td className="px-4 py-2">{r.phoneNumber}</td>
              <td className="px-4 py-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
                  onClick={() => handleDeleteRecruiter(r._id)}
                >
                  <Trash size={16} /> Remove
                </Button>
              </td>
            </tr>
          ))}
          {recruiters.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-blue-500">
                No recruiters found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
);
};
export default ManageRecruiter;