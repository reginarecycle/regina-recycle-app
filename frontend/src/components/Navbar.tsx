import { useState } from "react";
import logo from "../assets/logo.svg";
import { Button } from "@/components/ui/button";

function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollToId =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const el = document.getElementById(id);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });

      
      setOpen(false);
    };

  return (
    <nav
      className="
        sticky top-0 z-50 w-full
        bg-white/20
        backdrop-blur-[20px]
        shadow-[0_0_4px_rgba(0,0,0,0.25)]
        border-b border-white/20
      "
    >
      <div className="w-full px-6 md:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="ReginaRecycle logo" className="w-6 h-6" />
          <h1 className="text-2xl font-bold leading-8">
            <span className="text-black">Regina</span>
            <span className="text-[#618171]">Recycle</span>
          </h1>
        </div>

        
        <div className="hidden md:flex items-center gap-8 text-sm text-[#10131D]">
          <a
            href="#about"
            onClick={scrollToId("about")}
            className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]"
          >
            About
          </a>
          <a
            href="#benefit"
            onClick={scrollToId("benefit")}
            className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]"
          >
            Benefit
          </a>
          <a
            href="#learn"
            onClick={scrollToId("learn")}
            className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]"
          >
            Learn
          </a>
          <a
            href="#faqs"
            onClick={scrollToId("faqs")}
            className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]"
          >
            FAQs
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 px-5 border-[#344E41] text-[#344E41] font-bold hover:bg-[#E8FFF2]"
            >
              Login
            </Button>

            <Button className="h-10 px-5 bg-[#344E41] font-bold hover:bg-[#2F4F3F]">
              Get Started
            </Button>
          </div>

          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-black/10 bg-white/70"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      
           {open && (
        <>
          
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

         
          <div className="fixed top-20 left-0 right-0 z-50 sm:hidden border-t border-black/10 bg-white/95 backdrop-blur-[20px]">
            <div className="px-6 md:px-16 py-4 flex flex-col gap-4">
              <a
                href="#about"
                onClick={scrollToId("about")}
                className="text-[#0C111D] text-base font-medium hover:text-[#618171]"
              >
                About
              </a>
              <a
                href="#benefit"
                onClick={scrollToId("benefit")}
                className="text-[#0C111D] text-base font-medium hover:text-[#618171]"
              >
                Benefit
              </a>
              <a
                href="#learn"
                onClick={scrollToId("learn")}
                className="text-[#0C111D] text-base font-medium hover:text-[#618171]"
              >
                Learn
              </a>
              <a
                href="#faqs"
                onClick={scrollToId("faqs")}
                className="text-[#0C111D] text-base font-medium hover:text-[#618171]"
              >
                FAQs
              </a>

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full h-10 border-[#344E41] text-[#344E41] font-bold hover:bg-[#E8FFF2]"
                >
                  Login
                </Button>
                <Button className="w-full h-10 bg-[#344E41] font-bold hover:bg-[#2F4F3F]">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;