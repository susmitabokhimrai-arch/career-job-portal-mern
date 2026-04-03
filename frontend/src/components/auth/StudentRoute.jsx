import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null && user.role === "recruiter") {
      navigate("/admin/companies");
    }
    if (user !== null && user.role === "admin") {
      navigate("/admin/manage-recruiter");
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default StudentRoute;