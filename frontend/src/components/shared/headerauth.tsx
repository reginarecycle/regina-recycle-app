import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes } from "@/routes/routes";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === Routes.login) {
      navigate(Routes.onboarding);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full mb-6">
      <div
        onClick={handleBack}
        className="flex items-center gap-1 text-2xl cursor-pointer mb-4"
      >
        <ArrowLeft />
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm text-paragraph">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
