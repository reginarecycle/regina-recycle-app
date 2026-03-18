// this is the navbar before the user logs in

import { useState } from "react";
import logo from "@/assets/logoicon.svg";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navLinks = [
        { label: "About", href: "#" },
        { label: "Benefit", href: "#" },
        { label: "Learn", href: "#" },
        { label: "FAQs", href: "#" },
    ];

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src={logo} alt="ReginaRecycle logo" className="w-6 h-6" />
                    <h1 className="text-2xl font-bold leading-8">
                        <span className="text-black">Regina</span>
                        <span className="text-[#618171]">Recycle</span>
                    </h1>
                </div>

                {/* Desktop Navigation + Buttons */}
                <div className="hidden md:flex items-center gap-10">
                    {/* Links */}
                    <div className="flex items-center gap-8 text-sm text-[#10131D]">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="
                  text-[#0C111D] text-base font-medium leading-6
                  transition hover:text-[#618171]
                "
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            className="
                flex items-center justify-center
                h-10 px-5
                rounded-lg
                border border-[#344E41]
                bg-white
                text-[#344E41] text-base font-bold leading-6
                transition hover:bg-[#E8FFF2]
              "
                            size="lg"
                            variant="secondary"
                        >
                            Login
                        </Button>

                        <Button
                            className="
                flex items-center justify-center gap-2
                w-[132px]
                px-4 py-2
                rounded-lg
                bg-[#344E41]
                text-white text-base font-bold leading-6
                transition hover:bg-[#2F4F3F]
              "
                            size="lg"
                            variant="secondary"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>

                {/* Mobile Hamburger Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </Button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/20 bg-white/80 backdrop-blur-[20px]">
                    <div className="px-4 py-6 flex flex-col gap-6">
                        {/* Mobile Links */}
                        <div className="flex flex-col gap-5">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="
                    text-[#0C111D] text-base font-medium
                    transition hover:text-[#618171]
                    py-2
                  "
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Mobile Buttons */}
                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200/30">
                            <Button
                                className="
                  h-11 w-full
                  rounded-lg
                  border border-[#344E41]
                  bg-white
                  text-[#344E41] text-base font-bold
                  transition hover:bg-[#E8FFF2]
                "
                                variant="secondary"
                            >
                                Login
                            </Button>

                            <Button
                                className="
                  h-11 w-full
                  rounded-lg
                  bg-[#344E41]
                  text-white text-base font-bold
                  transition hover:bg-[#2F4F3F]
                "
                                variant="secondary"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;