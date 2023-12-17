import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/users");
    }
  }, [navigate]);
  return (
    <div className="flex justify-center items-center h-screen bg-orange-400-100">
      <div className="max-w-sm w-full bg-white p-6 rounded-md shadow-md">
        <h1 className="text-lg font-bold mb-4">Login to Your Account</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
