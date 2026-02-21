import { type FC } from "react";
import User from "@/assets/user.svg?react";
import Admin from "@/assets/admin.svg?react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Routes } from "@/routes/routes";

const onboardingOptions = [
  {
    title: "User",
    description:
      "I want to manage my household or business waste and schedule pickups.",
    icon: User,
    link: Routes.register,
  },
  {
    title: "Collector",
    description:
      "I am a service provider responsible for picking up and processing waste.",
    icon: Admin,
    link: Routes.collectorRegister,
  },
];

const Onboarding: FC = () => {
  return (
    <section>
      <div className="space-y-1">
        <h2 className="text-3xl font-black">Get Started!</h2>
        <p className="text-sm text-muted-foreground">
          Choose how you want to contribute to a greener Regina.
        </p>
      </div>
      {onboardingOptions.map((option) => (
        <Link to={option.link} key={option.title}>
          <div className="bg-white border rounded-3xl px-6 py-8 flex items-center gap-5 mt-6 hover:border-primary ease-in-out">
            <div className="bg-light-green rounded-xl p-2.5">
              <option.icon />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-lg font-bold">{option.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {option.description}
              </p>
            </div>
            <ChevronRight className="text-paragraph h-8 w-8 shrink-0 ml-auto" />
          </div>
        </Link>
      ))}
      <p className="mt-10">
        Already have an have account?
        <Link to={Routes.login}>
          <span className="font-black text-accent-foreground">Login</span>
        </Link>
      </p>
    </section>
  );
};

export default Onboarding;
