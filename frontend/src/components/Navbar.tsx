import logo from "../assets/logo.svg"

function Navbar() {
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
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <img src={logo} alt="ReginaRecycle logo" className="w-6 h-6" />
                    <h1 className="text-2xl font-bold leading-8">
                        <span className="text-black">Regina</span>
                        <span className="text-[#618171]">Recycle</span>
                    </h1>
                </div>


                <div className="hidden md:flex items-center gap-8 text-sm text-[#10131D]">
                    <a
                        href="#"
                        className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]"
                    >
                        About
                    </a>

                    <a href="#" className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]">
                        Benefit
                    </a>
                    <a href="#" className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]">
                        Learn
                    </a>
                    <a href="#" className="text-[#0C111D] text-base font-medium leading-6 transition hover:text-[#618171]">
                        FAQs
                    </a>

                </div>


                <div className="flex items-center gap-3">
                    <button
  className="
    flex items-center justify-center
    h-10 px-5
    rounded-lg
    border border-[#344E41]
    bg-white
    text-[#344E41] text-base font-bold leading-6
    transition
    hover:bg-[#E8FFF2]
  "
>
  Login
</button>


                    <button
  className="
    flex items-center justify-center gap-2
    w-[132px]
    px-4 py-2
    rounded-lg
    bg-[#344E41]
    text-white text-base font-bold leading-6
    transition
    hover:bg-[#2F4F3F]
  "
>
  Get Started
</button>

                </div>
            </div>
        </nav>
    )
}

export default Navbar
