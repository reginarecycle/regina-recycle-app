import RRLogo from "@/assets/logo.svg?react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface IAuthNavProps {
  link: string;
  text: string;
}

export default function AuthNav({ link, text }: IAuthNavProps) {
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
          "px-4 sm:px-6 md:px-8 xl:px-0"
        )}
      >
        <Link to={link}>
          <RRLogo className="text-white max-lg:text-primary" />
        </Link>
        <Button size="lg" text={text} />
      </div>
    </nav>
  );
}
