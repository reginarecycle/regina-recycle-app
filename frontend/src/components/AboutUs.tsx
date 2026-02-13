import KidsRecycleImage from "../assets/KidsRecycleImg.png"
import ReginaMapImage from "../assets/map.png"
import RecyclePhoneImage from "../assets/RecyclePhones.png"

function AboutUs() {
    return (
        <section className="w-full py-20">
  <div className="max-w-7xl mx-auto px-6">
    <div className="rounded-2xl bg-[#FBFBFB] px-10 py-12">


                <div className="text-center">
                    <h2 className="text-[30px] font-black leading-[38px] text-black">
                        About Us
                    </h2>

                    <p className="mt-4 mx-auto max-w-[929px] text-[#999CA0] text-base font-normal leading-6 text-center">
                        ReginaRecycle is a community-focused recycling platform that makes recycling easy,
                        accessible for everyone, and supports a greener Regina.
                    </p>
                </div>


                <div className="mt-12 flex flex-col lg:flex-row lg:justify-center gap-[24px]">

                    <div className="w-full lg:w-[664px] h-[400px] rounded-xl overflow-hidden">
                        <img
                            src={KidsRecycleImage}
                            alt="Children learning to recycle"
                            className="w-full h-full object-cover object-[center_30%]"
                        />
                    </div>


                    <div
                        className="
              w-full lg:w-[451px] h-[400px]
              rounded-xl bg-[#F3FFF8]
              p-6
              shadow-[0_0_4px_rgba(0,0,0,0.10)]
              flex flex-col items-start gap-[10px]
            "
                    >
                        <h3 className="text-[30px] font-black leading-[38px] text-black">
                            Recycle with Confidence
                        </h3>

                        <p className="text-[#999CA0] text-base font-medium leading-6">
                            Learn what materials can be recycled, how to sort them properly,
                            and make better recycling decisions every day.
                        </p>

                        <a
                            href="#"
                            className="mt-4 text-[#344E41] text-sm font-bold leading-6 hover:underline transition"
                        >
                            Learn how to recycle →
                        </a>
                    </div>
                </div>


                <div className="mt-6 flex flex-col lg:flex-row lg:justify-center gap-[24px]">

                    <div
                        className="
              w-full lg:w-[451px] h-[444px]
              rounded-xl bg-[#FFFEF3]
              p-6
              shadow-[0_0_4px_rgba(0,0,0,0.10)]
              flex flex-col items-start gap-[10px]
            "
                    >
                        <h3 className="text-[30px] font-black leading-[38px] text-black">
                            Build a Greener Regina
                        </h3>

                        <p className="text-[#999CA0] text-base font-medium leading-6">
                            By making recycling accessible to everyone, ReginaRecycle helps create a cleaner,
                            more sustainable community.
                        </p>

                        <a
                            href="#"
                            className="mt-4 text-[#344E41] text-sm font-bold leading-6 hover:underline transition"
                        >
                            Explore the community →
                        </a>

                    </div>


                    <div className="w-full lg:w-[664px] h-[444px] rounded-xl overflow-hidden">
                        <img
                            src={ReginaMapImage}
                            alt="Map of Regina"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col lg:flex-row lg:justify-center gap-[24px]">

                    <div className="w-full lg:w-[664px] h-[444px] rounded-xl overflow-hidden">
                        <img
                            src={RecyclePhoneImage}
                            alt="Tracking recycling impact"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>


                    <div
  className="
    w-full lg:w-[451px] h-[444px]
    rounded-xl bg-[#F3FFF8]
    p-6
    shadow-[0_0_4px_rgba(0,0,0,0.10)]
    flex flex-col items-start gap-[10px]
  "
>

                    
                        <h3 className="text-[30px] font-black leading-[38px] text-black">
                            Track Your Impact
                        </h3>

                        <p className="text-[#999CA0] text-base font-medium leading-6">
                            See how much waste you've diverted from landfills and understand the real impact of your recycling efforts.

                        </p>

                        <a
                            href="#"
                            className="mt-4 text-[#344E41] text-sm font-bold leading-6 hover:underline transition"
                        >
                            See your impact →
                        </a>
                    </div>
                </div>

            </div>
            </div>
        </section>
    )
}

export default AboutUs
