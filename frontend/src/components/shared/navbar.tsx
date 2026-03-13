import { useEffect, useState } from "react";
import RRLogo from "@/assets/rrlogo.svg?react";
import { Button } from "../ui/button";
import { Routes } from "@/routes/routes";
import { useNavigate, useLocation } from "react-router-dom";

interface ToolbarLink {
  id: string;
  label: string;
  path?: string;
}

const navItems: ToolbarLink[] = [
  { id: "about", label: "About" },
  { id: "benefits", label: "Benefit" },
  { id: "learn", label: "Learn", path: Routes.learn },
  { id: "faq", label: "FAQ's" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Check if a nav item is active based on route or scroll section
  const isActive = (item: ToolbarLink) => {
    if (item.path && location.pathname === item.path) return true;
    if (location.pathname === "/" && activeSection === item.id) return true;
    return false;
  };

  useEffect(() => {
    // Only run scroll detection on home page
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["about", "benefits", "learn", "faq"];
      const navHeight = 80;
      const scrollY = document.documentElement.scrollTop;

      if (scrollY < 100) {
        setActiveSection("home");
        return;
      }

      let current = "home";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const buffer = section === "faq" ? 200 : 50;
          const offsetTop = element.offsetTop - navHeight - buffer;
          if (scrollY >= offsetTop) {
            current = section;
          }
        }
      }

      setActiveSection(current);
    };

    document.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => document.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const scrollToSection = (item: ToolbarLink) => {
    closeMenu();
    // If item has a route path, navigate there
    if (item.path && location.pathname !== "/") {
      navigate(item.path);
      return;
    }
    // Otherwise scroll to section on home page
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(item.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    setActiveSection(item.id);
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-foreground/40 backdrop-blur-lg z-40 top-24 lg:hidden transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <nav className="backdrop-blur-[20px] bg-white/40 shadow-sm sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-20 md:h-17.5">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <RRLogo className="text-primary" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-10 items-center h-full">
            {navItems.map((item) => (
              <div
                key={item.id}
                onClick={() => scrollToSection(item)}
                className={`flex items-center h-full px-2.5 text-base transition-colors border-b-2 cursor-pointer ${
                  isActive(item)
                    ? "text-primary font-semibold border-primary"
                    : "text-foreground hover:text-primary border-transparent"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex gap-3 items-center">
            <Button
              size="md"
              variant="outlineprimary"
              onClick={() => navigate(Routes.login)}
            >
              Login
            </Button>
            <Button size="md" onClick={() => navigate(Routes.onboarding)}>
              Get Started
            </Button>
          </div>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col gap-1.5 p-2 z-50 relative"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute bg-white w-full shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 p-6">
            {navItems.map((item) => (
              <div
                key={item.id}
                onClick={() => scrollToSection(item)}
                className={`flex items-start py-2 px-3 rounded-lg text-base transition-colors text-left ${
                  isActive(item)
                    ? "bg-card/90 text-accent-foreground font-semibold"
                    : "text-foreground hover:bg-card hover:text-accent-foreground"
                }`}
              >
                {item.label}
              </div>
            ))}

            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Button
                size="lg"
                variant="outlineprimary"
                className="w-full"
                onClick={() => navigate(Routes.login)}
              >
                Login
              </Button>
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate(Routes.register)}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
