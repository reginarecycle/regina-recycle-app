import { Outlet, useLocation } from "react-router-dom";
import AuthImage from "@/assets/images/authimage.png";
import AuthNav from "../shared/authnav";
import { Routes } from "@/routes/routes";

const AuthLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === Routes.login;
  const isOnboardingPage = location.pathname.startsWith("/auth/onboarding");

  const navText = isLoginPage ? "Get Started" : "Login";
  const navLink = isLoginPage
    ? Routes.onboarding
    : isOnboardingPage
    ? Routes.login
    : Routes.login;

  return (
    <main>
      <AuthNav link={navLink} text={navText} />
      <div className="h-dvh flex overflow-hidden justify-center">
        <div className="hidden xl:flex w-1/2 h-full relative">
          <div className="absolute inset-0 bg-linear-to-b from-white/0 to-[#344E41]/81"></div>
          <img
            src={AuthImage}
            alt="Authentication Background"
            className="w-full h-full"
          />
          <div className="absolute bottom-8 left-8 flex flex-col items-start text-white p-8">
            <h5 className="text-4xl font-black mb-3">There is no Planet B</h5>
            <div className="w-14 h-1 bg-white mb-4"></div>
            <p className="text-base text-white/70 font-medium">
              Recycle today for a sustainable environment while making money.
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white flex flex-col items-center justify-center pt-52 2xl:mt-10 py-12 px-12 container overflow-y-scroll">
          <Outlet />

          <p className="text-sm font-medium text-center mt-12 lg:mt-4">
            © 2026 ReginaRecycle. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
