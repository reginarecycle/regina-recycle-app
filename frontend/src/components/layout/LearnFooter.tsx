import logo from "@/assets/logo.svg";

function LearnFooter() {
    return (
        <div className="w-full bg-white mt-auto border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">

                    {/* Left side: logo + brand name */}
                    <div className="flex items-center gap-2 shrink-0">
                        <img
                            src={logo}
                            alt="ReginaRecycle logo"
                            className="w-6 h-6"
                        />
                        <h2 className="text-2xl font-bold leading-8 whitespace-nowrap">
                            <span className="text-black">Regina</span>
                            <span className="text-[#618171]">Recycle</span>
                        </h2>
                    </div>

                    {/* Right side: copyright */}
                    <div>
                        <p className="text-sm font-medium leading-5 text-black text-right">
                            © 2026 ReginaRecycle. All rights reserved.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LearnFooter;
