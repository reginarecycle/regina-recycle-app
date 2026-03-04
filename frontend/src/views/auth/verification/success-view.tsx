import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { useNavigate } from "react-router-dom";
import Confetti from "@/assets/images/regina-recycle-confetti.gif";

const VerficationSuccessView = () => {
  const navigate = useNavigate();
  return (
    <section>
      <img src={Confetti} alt="Success" className="mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-center mb-6">
        Verification Successful!
      </h2>
      <p className="text-center text-muted-foreground mb-8 max-w-md">
        Awesome, you've verified your email. you can now access all the features
        in ReginaRecycle
      </p>
      <div className="flex justify-center">
        <Button onClick={() => navigate(Routes.login)}>Go to Login</Button>
      </div>
    </section>
  );
};

export default VerficationSuccessView;
