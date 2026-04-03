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

      fetchRecruiters(); // refresh list
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
      <Navbar/>
    
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Recruiters</h1>
</div>
      {/* Add Recruiter Form */}
      <form
        className="p-4 border rounded-lg shadow space-y-4"
        onSubmit={handleAddRecruiter}
      >
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <UserPlus size={20} /> Add Recruiter
        </h2>

        <div className="flex flex-col">
          <Label>Full Name</Label>
          <Input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full Name"
          />
        </div>

        <div className="flex flex-col">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <div className="flex flex-col">
          <Label>Phone Number</Label>
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
          />
        </div>

        <div className="flex flex-col">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Recruiter"}
        </Button>
      </form>

      {/* Recruiter List */}
      <div className="p-4 border rounded-lg shadow space-y-2">
        <h2 className="font-semibold text-lg">All Recruiters ({recruiters.length})</h2>
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Phone</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="px-2 py-1">{r.fullname}</td>
                <td className="px-2 py-1">{r.email}</td>
                <td className="px-2 py-1">{r.phoneNumber}</td>
                <td className="px-2 py-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRecruiter(r._id)}
                  >
                    <Trash size={16} /> Remove
                  </Button>
                </td>
              </tr>
            ))}
            {recruiters.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No recruiters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRecruiter;