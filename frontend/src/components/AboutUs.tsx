import KidsRecycleImage from "../assets/KidsRecycleImg.png";
import ReginaMapImage from "../assets/map.png";
import RecyclePhoneImage from "../assets/RecyclePhones.png";

function AboutUs() {
  return (
    <section id="about" className="w-full bg-[#FBFBFB] py-20 scroll-mt-24">
      <div className="mx-auto w-full max-w-[1512px] px-6 md:px-16">
        <div className="px-4 md:px-10 py-12">
          <div className="text-center">
            <h2 className="text-[30px] font-black leading-[38px] text-black">
              About Us
            </h2>

            <p className="mx-auto mt-4 max-w-[929px] text-center text-base font-normal leading-6 text-[#999CA0]">
              ReginaRecycle is a community-focused recycling platform that makes recycling easy,
              accessible for everyone, and supports a greener Regina.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-[24px] lg:flex-row lg:justify-center">
            <div className="h-[400px] w-full overflow-hidden rounded-xl lg:w-[664px]">
              <img
                src={KidsRecycleImage}
                alt="Children learning to recycle"
                className="h-full w-full object-cover object-[center_30%]"
              />
            </div>

            <div
              className="
                flex h-[400px] w-full flex-col items-start gap-[10px]
                rounded-xl bg-[#F3FFF8] p-6
                shadow-[0_0_4px_rgba(0,0,0,0.10)]
                lg:w-[451px]
              "
            >
              <h3 className="text-[30px] font-black leading-[38px] text-black">
                Recycle with Confidence
              </h3>

              <p className="text-base font-medium leading-6 text-[#999CA0]">
                Learn what materials can be recycled, how to sort them properly,
                and make better recycling decisions every day.
              </p>

              <a
                href="#"
                className="mt-4 text-sm font-bold leading-6 text-[#344E41] transition hover:underline"
              >
                Learn how to recycle →
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-[24px] lg:flex-row lg:justify-center">
            <div
              className="
                flex h-[444px] w-full flex-col items-start gap-[10px]
                rounded-xl bg-[#FFFEF3] p-6
                shadow-[0_0_4px_rgba(0,0,0,0.10)]
                lg:w-[451px]
              "
            >
              <h3 className="text-[30px] font-black leading-[38px] text-black">
                Build a Greener Regina
              </h3>

              <p className="text-base font-medium leading-6 text-[#999CA0]">
                By making recycling accessible to everyone, ReginaRecycle helps create a cleaner,
                more sustainable community.
              </p>

              <a
                href="#"
                className="mt-4 text-sm font-bold leading-6 text-[#344E41] transition hover:underline"
              >
                Explore the community →
              </a>
            </div>

            <div className="h-[444px] w-full overflow-hidden rounded-xl lg:w-[664px]">
              <img
                src={ReginaMapImage}
                alt="Map of Regina"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-[24px] lg:flex-row lg:justify-center">
            <div className="h-[444px] w-full overflow-hidden rounded-xl lg:w-[664px]">
              <img
                src={RecyclePhoneImage}
                alt="Tracking recycling impact"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div
              className="
                flex h-[444px] w-full flex-col items-start gap-[10px]
                rounded-xl bg-[#F3FFF8] p-6
                shadow-[0_0_4px_rgba(0,0,0,0.10)]
                lg:w-[451px]
              "
            >
              <h3 className="text-[30px] font-black leading-[38px] text-black">
                Track Your Impact
              </h3>

              <p className="text-base font-medium leading-6 text-[#999CA0]">
                See how much waste you've diverted from landfills and understand the real impact of your recycling efforts.
              </p>

              <a
                href="#"
                className="mt-4 text-sm font-bold leading-6 text-[#344E41] transition hover:underline"
              >
                See your impact →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;