import FeatureCard from "./FeatureCard"

import CalendarIcon from "../assets/icons/calendar.svg"
import LocationIcon from "../assets/icons/location.svg"
import TrophyIcon from "../assets/icons/trophy.svg"
import LeafIcon from "../assets/icons/leaf.svg"

function WhyUse() {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[30px] font-black leading-[38px] text-black">
          Why Use ReginaRecycle
        </h2>

        <p className="mt-2 text-[#999CA0] text-base leading-6">
          Built to support the Regina community in reducing waste and recycling smarter.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            iconSrc={CalendarIcon}
            iconBg="#E9FFFD"
            title="Recycle on Your Schedule"
            description="Easily schedule at-home pickups or drop-off recyclables when it works best for you."
          />

          <FeatureCard
            iconSrc={LocationIcon}
            iconBg="#FFE9E9"
            title="Find Local Centers"
            description="Locate the nearest recycling points easily with our integrated map. Filter by material type."
          />

          <FeatureCard
            iconSrc={TrophyIcon}
            iconBg="#FFF4D6"
            title="Earn Rewards for Recycling"
            description="Collect money or points for your recyclables and redeem them through your wallet or rewards card."
          />

          <FeatureCard
            iconSrc={LeafIcon}
            iconBg="#E9FFE9"
            title="Track Your Impact"
            description="View your recycling stats and see how your actions contribute to a cleaner, greener Regina."
          />
        </div>
      </div>
    </section>
  )
}

export default WhyUse
