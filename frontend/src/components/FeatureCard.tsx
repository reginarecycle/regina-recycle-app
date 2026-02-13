type FeatureCardProps = {
  iconSrc: string
  iconBg?: string
  title: string
  description: string
}

function FeatureCard({
  iconSrc,
  iconBg = "#E9FFFD",
  title,
  description,
}: FeatureCardProps) {
  return (
    <div
      className="
        w-full sm:w-[300px] h-auto sm:h-[233px]
        rounded-xl bg-white
        p-4
        shadow-[0_0_4px_rgba(0,0,0,0.15)]
        flex flex-col justify-center items-start gap-[10px]
      "
    >
      
      <div
        className="w-[52px] h-[51px] py-1 flex items-center justify-center rounded-2xl"
        style={{ backgroundColor: iconBg }}
      >
        <img src={iconSrc} alt="" className="w-6 h-6" />
      </div>

      
      <h3 className="text-[18px] font-bold leading-7 text-[#10131D]">
        {title}
      </h3>

      
      <p className="text-base font-normal leading-6 text-black max-w-[267px]">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard
