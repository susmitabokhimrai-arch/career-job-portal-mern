import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Profile</h1>

      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: "6px",
          marginTop: "10px"
        }}
      >
        Go to Dashboard 📊
      </button>
    </div>
  );
};

export default AdminProfile;