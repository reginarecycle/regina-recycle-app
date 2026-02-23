import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import Confetti from "@/assets/images/regina-recycle-confetti.gif";

type SuccessType = "reset-password" | "email-verification";

const SUCCESS_CONTENT: Record<SuccessType, { title: string; message: string }> =
  {
    "reset-password": {
      title: "Password Reset Successful!",
      message:
        "Congratulations, your password has been updated. You can now use your new password to log in.",
    },
    "email-verification": {
      title: "Verification Successful!",
      message:
        "Awesome, you've verified your email. You can now access all the features in ReginaRecycle.",
    },
  };

const SuccessView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type =
    (searchParams.get("type") as SuccessType) || "email-verification";
  const { title, message } = SUCCESS_CONTENT[type];

  return (
    <section className="flex flex-col items-center">
      <img src={Confetti} alt="Success" className="mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-md">
        {message}
      </p>
      <Button onClick={() => navigate(Routes.login)}>Go to Login</Button>
    </section>
  );
};

export default SuccessView;
