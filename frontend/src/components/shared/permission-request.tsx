import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import SadBin from "../ui/sad-bin";
import { Button } from "../ui/button";
import { Routes } from "@/routes/routes";

type Props = {
  permission: Array<string>;
};

const PermissionRequest: FC<Props> = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-8 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #2b4132 0%, #8aab95 25%, #b8d4be 60%, #ddeedd 100%)" }}
    >
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black pointer-events-none select-none text-white/30 opacity-80 w-full text-center"
        style={{ fontSize: "clamp(60px, 20vw, 380px)", letterSpacing: "-4px" }}
      >
        DENIED
      </span>

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg text-center gap-0">
        <div className="w-[clamp(180px,34vw,260px)] mb-[clamp(16px,3vh,28px)]">
          <SadBin />
        </div>

        <h2
          className="font-bold text-foreground leading-tight mb-2.5"
          style={{ fontSize: "clamp(20px, 3.5vw, 30px)" }}
        >
          Access Denied — Wrong Bin!
        </h2>

        <p
          className="text-foreground/70 leading-relaxed max-w-sm mb-[clamp(20px,3vh,32px)]"
          style={{ fontSize: "clamp(13px, 1.8vw, 15px)" }}
        >
          Oops! This content is sorted in a restricted bin. You don't have
          permission to access this area. Let's get you back to where you belong!
        </p>

        <div className="flex flex-wrap gap-2.5 justify-center">
          <Button size="lg" onClick={() => navigate(Routes.base)}>
            Go home
          </Button>

          <Button size="lg" variant='outlineprimary' onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>

      </div>
    </div>
  );
};
export default PermissionRequest;
