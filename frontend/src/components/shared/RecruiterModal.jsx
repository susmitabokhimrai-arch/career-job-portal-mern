import React, { useState } from "react";
import axios from "axios";

const RecruiterModal = ({ onClose }) => {
  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    contact_email: "",
    phone: "",
    internship_details: "",
  });

  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.company_name || !form.contact_email || !form.internship_details) {
      alert("Please fill in Company Name, Email and Internship Details.");
      return;
    }

    setStatus("sending");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/recruiter-request",  
        form
      );

      if (res.data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-white text-lg font-semibold mb-1">Post an Internship</h2>
        <p className="text-gray-400 text-sm mb-5">
          Fill in your details and our admin will reach out within 24 hours.
        </p>

        {status === "success" ? (
          <div className="text-center py-8">
            <p className="text-green-400 text-4xl mb-3">✓</p>
            <p className="text-white font-medium text-lg">Request Sent!</p>
            <p className="text-gray-400 text-sm mt-1">
              Our admin will contact you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-5 bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <input
                name="company_name"
                placeholder="Company Name *"
                value={form.company_name}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <input
                name="contact_person"
                placeholder="Contact Person"
                value={form.contact_person}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <input
                name="contact_email"
                type="email"
                placeholder="Email Address *"
                value={form.contact_email}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <textarea
                name="internship_details"
                placeholder="Describe the internship role, duration, and requirements *"
                rows={4}
                value={form.internship_details}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm mt-3">
                Something went wrong. Please try again or email us directly at support@careeryatra.com
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "sending"}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Submit Request"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterModal;