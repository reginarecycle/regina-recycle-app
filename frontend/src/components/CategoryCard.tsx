type Item = {
  text: string
  type: "good" | "bad"
}

type CategoryCardProps = {
  title: string
  iconSrc: string
  headerBg: string
  items: Item[]
  goodIconSrc: string
  badIconSrc: string
}

function CategoryCard({
  title,
  iconSrc,
  headerBg,
  items,
  goodIconSrc,
  badIconSrc,
}: CategoryCardProps) {
  return (
    <div
      className="
        w-[252px] h-[272px]
        border border-[#EBE9E8]
        rounded-xl
        bg-white
        overflow-hidden
        flex flex-col
      "
    >
      
      <div
        className="
          h-[146px] w-full
          flex items-center justify-center
          px-[92px] py-[35px]
          rounded-t-xl
        "
        style={{ backgroundColor: headerBg }}
      >
        <img src={iconSrc} alt={`${title} icon`} className="w-[68px] h-[76px]" />
      </div>

      
      <div className="flex flex-col gap-[10px] p-4">
        <h3 className="text-[20px] font-bold leading-[30px] text-black">
          {title}
        </h3>

        <div className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <img
                src={item.type === "good" ? goodIconSrc : badIconSrc}
                alt={item.type === "good" ? "Allowed" : "Not allowed"}
                className="w-4 h-4"
              />
              <span
                className={
                  item.type === "good"
                    ? "text-[#22C55E] text-sm"
                    : "text-[#EF4444] text-sm"
                }
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
