import heroImage from "../assets/hero-image.svg";

function Hero() {
    return (
        <section className="w-full bg-gradient-to-r from-green-100 to-white py-20">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">


                <div className="max-w-xl">


                    <span className="bg-[#618171] text-white text-sm font-bold leading-6 px-4 py-1 rounded-full">
                        #1 Recycling App
                    </span>


                    <h1 className="mt-6 text-6xl font-black leading-[72px] text-black">
                         Make Everyday Waste <br />
                        Count <span className="text-[#618171]">R| .</span>
                    </h1>


                    <p className="mt-6 text-[#10131D] text-base font-normal leading-6 max-w-[612px]">
                        Track your recycling, learn what can be reused, and reduce everyday waste with
                        an easy-to-use recycling platform designed for real life.
                    </p>


                    <div className="mt-8 flex gap-4">
                        <button
                            className="
    flex items-center justify-center gap-2
    w-[234px] h-[48px]
    px-4 py-2
    rounded-lg
    border border-[#618171]
    bg-white
    text-[#344E41] text-base font-bold leading-6
    transition
    hover:bg-[#E8FFF2]
  "
                        >
                            Learn →
                        </button>


                        <button
                            className="
    flex items-center justify-center gap-2
    w-[234px] h-[48px]
    px-4 py-2
    rounded-lg
    bg-[#344E41] text-white
    text-base font-semibold leading-6
    transition
    hover:bg-[#2F4F3F]
  "
                        >
                            Get Started
                        </button>

                    </div>

                </div>


                <div>
                    <img
                        src={heroImage}
                        alt="Recycling illustration"
                        className="w-[500px]"
                    />
                </div>

            </div>
        </section>
    )
}

export default Hero
