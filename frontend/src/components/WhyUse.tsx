import FeatureCard from "./FeatureCard";

import CalendarIcon from "../assets/icons/calendar.svg";
import LocationIcon from "../assets/icons/location.svg";
import TrophyIcon from "../assets/icons/trophy.svg";
import LeafIcon from "../assets/icons/leaf.svg";

function WhyUse() {
  return (
    <section id="benefit" className="w-full py-16 scroll-mt-24">
      <div className="w-full px-6 md:px-16">
        <h2 className="text-[30px] font-black leading-[38px] text-black">
          Why Use Regina<span className="text-[#344E41]">Recycle</span>
        </h2>

        <p className="mt-2 text-[#999CA0] text-base leading-6">
          Built to support the Regina community in reducing waste and recycling smarter.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            iconSrc={CalendarIcon}
            title="Recycle on Your Schedule"
            description="Easily schedule at-home pickups or drop-off recyclables when it works best for you."
          />

          <FeatureCard
            iconSrc={LocationIcon}
            title="Find Local Centers"
            description="Locate the nearest recycling points easily with our integrated map. Filter by material type."
          />

          <FeatureCard
            iconSrc={TrophyIcon}
            title="Earn Rewards for Recycling"
            description="Collect money or points for your recyclables and redeem them through your wallet or rewards card."
          />

          <FeatureCard
            iconSrc={LeafIcon}
            title="Track Your Impact"
            description="View your recycling stats and see how your actions contribute to a cleaner, greener Regina."
          />
        </div>
      </div>
    </section>
  );
}

export default WhyUse;