type FeatureCardProps = {
  iconSrc: string;
  title: string;
  description: string;
};

function FeatureCard({
  iconSrc,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div
      className="
        group
        w-full sm:w-[300px] h-auto sm:h-[233px]
        rounded-xl bg-white
        p-4
        shadow-[0_0_4px_rgba(0,0,0,0.15)]
        flex flex-col justify-center items-start gap-[10px]
        transition-all duration-200
        hover:bg-[#344E41]
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-center justify-center">
        <img src={iconSrc} alt="" className="w-[52px] h-[51px]" />
      </div>

      <h3 className="text-[18px] font-bold leading-7 text-[#10131D] transition-colors duration-200 group-hover:text-white">
        {title}
      </h3>

      <p className="max-w-[267px] text-base font-normal leading-6 text-black transition-colors duration-200 group-hover:text-white">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;