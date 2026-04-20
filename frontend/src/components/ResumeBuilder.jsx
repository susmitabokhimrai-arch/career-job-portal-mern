import React, { useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authslice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Plus, Trash2, Download, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const ResumeBuilder = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const resumeRef = useRef();
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const [form, setForm] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phone: user?.phoneNumber || "",
        address: "",
        linkedin: "",
        summary: "",
        education: [{ degree: "", university: "", year: "", gpa: "" }],
        experience: [{ company: "", role: "", duration: "", description: "" }],
        skills: user?.profile?.skills?.join(", ") || "",
        projects: [{ title: "", description: "", link: "" }]
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (section, index, field, value) => {
        const updated = [...form[section]];
        updated[index][field] = value;
        setForm({ ...form, [section]: updated });
    };

    const addItem = (section, emptyItem) => {
        setForm({ ...form, [section]: [...form[section], emptyItem] });
    };

    const removeItem = (section, index) => {
        const updated = form[section].filter((_, i) => i !== index);
        setForm({ ...form, [section]: updated });
    };

    const generatePDFBlob = async () => {
        const element = resumeRef.current;
        const originalBackground = element.style.background;
        element.style.background = "#ffffff";

        const canvas = await html2canvas(element, {
            scale: 1,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff"
        });

        element.style.background = originalBackground;

        const imgData = canvas.toDataURL("image/jpeg", 0.7);
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        return pdf;
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const pdf = await generatePDFBlob();
            pdf.save(`${form.fullname || "resume"}.pdf`);
            toast.success("Resume downloaded successfully!");
        } catch (error) {
            toast.error("Failed to download resume.");
        } finally {
            setDownloading(false);
        }
    };

    const handleSaveToProfile = async () => {
        setSaving(true);
        try {
            const pdf = await generatePDFBlob();
            const pdfBlob = pdf.output("blob");
            const fileName = `${form.fullname || "resume"}.pdf`;
            const file = new File([pdfBlob], fileName, { type: "application/pdf" });

            const formData = new FormData();
            formData.append("file", file);
            formData.append("fullname", user.fullname);
            formData.append("email", user.email);
            formData.append("phoneNumber", user.phoneNumber);

            const res = await axios.post(
                `${USER_API_END_POINT}/profile/update`,
                formData,
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Resume saved to your profile!");
                navigate("/profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save resume to profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/profile")}
                            className="p-2 rounded-lg hover:bg-gray-200 transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
                            <p className="text-sm text-gray-400">Fill in your details and generate a professional resume</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            variant="outline"
                            className="flex items-center gap-2 border-green-300 text-green-600 hover:bg-green-50"
                        >
                            {downloading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</>
                                : <><Download className="w-4 h-4" /> Download PDF</>
                            }
                        </Button>
                        <Button
                            onClick={handleSaveToProfile}
                            disabled={saving}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {saving
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                : <><Save className="w-4 h-4" /> Save to Profile</>
                            }
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT — Form */}
                    <div className="space-y-6">

                        {/* Personal Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Full Name", name: "fullname", placeholder: "John Doe" },
                                    { label: "Email", name: "email", placeholder: "john@email.com" },
                                    { label: "Phone", name: "phone", placeholder: "+977 98XXXXXXXX" },
                                    { label: "Address", name: "address", placeholder: "Kathmandu, Nepal" },
                                    { label: "LinkedIn", name: "linkedin", placeholder: "linkedin.com/in/john" },
                                ].map((field) => (
                                    <div key={field.name} className={field.name === "linkedin" ? "col-span-2" : ""}>
                                        <label className="text-xs font-medium text-gray-600 block mb-1">{field.label}</label>
                                        <input
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 mb-4">Professional Summary</h2>
                            <textarea
                                name="summary"
                                value={form.summary}
                                onChange={handleChange}
                                placeholder="Write a brief summary about yourself..."
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none"
                            />
                        </div>

                        {/* Education */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-800">Education</h2>
                                <button
                                    onClick={() => addItem("education", { degree: "", university: "", year: "", gpa: "" })}
                                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                                >
                                    <Plus className="w-3 h-3" /> Add
                                </button>
                            </div>
                            {form.education.map((edu, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-xl relative">
                                    {form.education.length > 1 && (
                                        <button
                                            onClick={() => removeItem("education", index)}
                                            className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Degree", field: "degree", placeholder: "Bachelor of Computer Science" },
                                            { label: "University", field: "university", placeholder: "Tribhuvan University" },
                                            { label: "Year", field: "year", placeholder: "2020 - 2024" },
                                            { label: "GPA", field: "gpa", placeholder: "3.8 / 4.0" },
                                        ].map((item) => (
                                            <div key={item.field}>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">{item.label}</label>
                                                <input
                                                    value={edu[item.field]}
                                                    onChange={(e) => handleArrayChange("education", index, item.field, e.target.value)}
                                                    placeholder={item.placeholder}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Experience */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-800">Experience</h2>
                                <button
                                    onClick={() => addItem("experience", { company: "", role: "", duration: "", description: "" })}
                                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                                >
                                    <Plus className="w-3 h-3" /> Add
                                </button>
                            </div>
                            {form.experience.map((exp, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-xl relative">
                                    {form.experience.length > 1 && (
                                        <button
                                            onClick={() => removeItem("experience", index)}
                                            className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Company", field: "company", placeholder: "Google" },
                                            { label: "Role", field: "role", placeholder: "Software Engineer Intern" },
                                            { label: "Duration", field: "duration", placeholder: "Jun 2023 - Aug 2023" },
                                        ].map((item) => (
                                            <div key={item.field}>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">{item.label}</label>
                                                <input
                                                    value={exp[item.field]}
                                                    onChange={(e) => handleArrayChange("experience", index, item.field, e.target.value)}
                                                    placeholder={item.placeholder}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                                />
                                            </div>
                                        ))}
                                        <div className="col-span-2">
                                            <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)}
                                                placeholder="Describe your responsibilities and achievements..."
                                                rows={2}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 mb-4">Skills</h2>
                            <input
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB, Python (comma separated)"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                            />
                        </div>

                        {/* Projects */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-800">Projects</h2>
                                <button
                                    onClick={() => addItem("projects", { title: "", description: "", link: "" })}
                                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                                >
                                    <Plus className="w-3 h-3" /> Add
                                </button>
                            </div>
                            {form.projects.map((project, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-xl relative">
                                    {form.projects.length > 1 && (
                                        <button
                                            onClick={() => removeItem("projects", index)}
                                            className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="space-y-3">
                                        {[
                                            { label: "Project Title", field: "title", placeholder: "CareerYatra Job Portal" },
                                            { label: "Project Link", field: "link", placeholder: "https://github.com/..." },
                                        ].map((item) => (
                                            <div key={item.field}>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">{item.label}</label>
                                                <input
                                                    value={project[item.field]}
                                                    onChange={(e) => handleArrayChange("projects", index, item.field, e.target.value)}
                                                    placeholder={item.placeholder}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                                />
                                            </div>
                                        ))}
                                        <div>
                                            <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
                                            <textarea
                                                value={project.description}
                                                onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)}
                                                placeholder="Describe what this project does..."
                                                rows={2}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT — Resume Preview */}
                    <div className="lg:sticky lg:top-24 lg:h-fit">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
                            <p className="text-sm text-gray-500 text-center">✨ Live Preview</p>
                        </div>

                        {/* Scrollable Wrapper */}
                        <div style={{ overflowX: "auto", background: "#f3f4f6", padding: "16px", borderRadius: "12px" }}>
                            <div
                                ref={resumeRef}
                                style={{
                                    width: "210mm",
                                    minHeight: "297mm",
                                    padding: "15mm",
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "11px",
                                    color: "#1a1a1a",
                                    boxSizing: "border-box",
                                    backgroundColor: "#ffffff",
                                    margin: "0 auto"
                                }}
                            >
                                {/* Header */}
                                <div style={{ borderBottom: "3px solid #7c3aed", paddingBottom: "12px", marginBottom: "16px" }}>
                                    <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#7c3aed", margin: "0 0 4px" }}>
                                        {form.fullname || "Your Name"}
                                    </h1>
                                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "10px", color: "#555" }}>
                                        {form.email && <span>📧 {form.email}</span>}
                                        {form.phone && <span>📞 {form.phone}</span>}
                                        {form.address && <span>📍 {form.address}</span>}
                                        {form.linkedin && <span>🔗 {form.linkedin}</span>}
                                    </div>
                                </div>

                                {/* Summary */}
                                {form.summary && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#7c3aed", borderBottom: "1px solid #e9d5ff", paddingBottom: "4px", marginBottom: "6px" }}>
                                            PROFESSIONAL SUMMARY
                                        </h2>
                                        <p style={{ lineHeight: "1.6", color: "#444" }}>{form.summary}</p>
                                    </div>
                                )}

                                {/* Education */}
                                {form.education.some(e => e.degree || e.university) && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#7c3aed", borderBottom: "1px solid #e9d5ff", paddingBottom: "4px", marginBottom: "8px" }}>
                                            EDUCATION
                                        </h2>
                                        {form.education.map((edu, i) => (
                                            edu.degree || edu.university ? (
                                                <div key={i} style={{ marginBottom: "8px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <strong style={{ fontSize: "11px" }}>{edu.degree}</strong>
                                                        <span style={{ color: "#666", fontSize: "10px" }}>{edu.year}</span>
                                                    </div>
                                                    <div style={{ color: "#555", fontSize: "10px" }}>{edu.university}</div>
                                                    {edu.gpa && <div style={{ color: "#777", fontSize: "10px" }}>GPA: {edu.gpa}</div>}
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                )}

                                {/* Experience */}
                                {form.experience.some(e => e.company || e.role) && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#7c3aed", borderBottom: "1px solid #e9d5ff", paddingBottom: "4px", marginBottom: "8px" }}>
                                            EXPERIENCE
                                        </h2>
                                        {form.experience.map((exp, i) => (
                                            exp.company || exp.role ? (
                                                <div key={i} style={{ marginBottom: "10px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <strong style={{ fontSize: "11px" }}>{exp.role}</strong>
                                                        <span style={{ color: "#666", fontSize: "10px" }}>{exp.duration}</span>
                                                    </div>
                                                    <div style={{ color: "#7c3aed", fontSize: "10px", fontWeight: "bold" }}>{exp.company}</div>
                                                    {exp.description && (
                                                        <p style={{ color: "#444", marginTop: "4px", lineHeight: "1.5" }}>{exp.description}</p>
                                                    )}
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                )}

                                {/* Skills */}
                                {form.skills && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#7c3aed", borderBottom: "1px solid #e9d5ff", paddingBottom: "4px", marginBottom: "8px" }}>
                                            SKILLS
                                        </h2>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                            {form.skills.split(",").map((skill, i) => (
                                                skill.trim() && (
                                                    <span key={i} style={{ background: "#f3e8ff", color: "#7c3aed", padding: "2px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "500" }}>
                                                        {skill.trim()}
                                                    </span>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {form.projects.some(p => p.title) && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#7c3aed", borderBottom: "1px solid #e9d5ff", paddingBottom: "4px", marginBottom: "8px" }}>
                                            PROJECTS
                                        </h2>
                                        {form.projects.map((project, i) => (
                                            project.title ? (
                                                <div key={i} style={{ marginBottom: "10px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <strong style={{ fontSize: "11px" }}>{project.title}</strong>
                                                        {project.link && (
                                                            <span style={{ color: "#7c3aed", fontSize: "10px" }}>{project.link}</span>
                                                        )}
                                                    </div>
                                                    {project.description && (
                                                        <p style={{ color: "#444", marginTop: "4px", lineHeight: "1.5" }}>{project.description}</p>
                                                    )}
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div style={{ borderTop: "1px solid #e9d5ff", paddingTop: "8px", marginTop: "20px", textAlign: "center", color: "#aaa", fontSize: "9px" }}>
                                    Generated by CareerYatra
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;