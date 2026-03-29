import RRLogo from "@/assets/auth-logo.svg?react";
import RRMLogo from "@/assets/rrlogo.svg?react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

export interface IAuthNavProps {
  link: string;
  text: string;
}

export default function AuthNav({ link, text }: IAuthNavProps) {
  const navigate = useNavigate();
  return (
    <nav
      className={cn(
        "h-20 sticky top-0 z-50 -mt-20 ",
        "backdrop-blur-sm shadow-sm bg-background/30"
      )}
    >
      <div
        className={cn(
          "xl:max-w-350 2xl:max-w-462.5 mx-auto h-full",
          "flex justify-between items-center",
          "px-4 sm:px-6 md:px-8 2xl:px-0"
        )}
      >
        <Link to={Routes.base}>
          <RRLogo className="max-xl:hidden lg:text-white max-lg:text-primary cursor-pointer" />
          <RRMLogo className="xl:hidden w-auto" />
        </Link>
        <Button size="lg" text={text} onClick={() => navigate(link)} />
      </div>
    </nav>
  );
}
