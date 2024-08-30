import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axiosInstance.post("/logout");
        localStorage.removeItem("authToken");
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
