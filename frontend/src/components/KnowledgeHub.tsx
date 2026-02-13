import PlasticIcon from "../assets/icons/plastic.svg"
import PaperIcon from "../assets/icons/paper.svg"
import GlassIcon from "../assets/icons/glass.svg"
import EwasteIcon from "../assets/icons/ewaste.svg"

function KnowledgeHub() {
  return (
    <section className="w-full bg-[#FBFBFB] py-20">
      <div className="max-w-7xl mx-auto px-6">

        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-wide text-[#999CA0] uppercase">
              Knowledge Hub
            </p>

            <h2 className="mt-2 text-[30px] font-black leading-[38px] text-black">
              What Can Be Recycled?
            </h2>

            <p className="mt-2 text-[#999CA0] text-base leading-6 max-w-[700px]">
              Confused about what goes in the blue bin? Browse our categories to sort smart.
            </p>
          </div>

          <a
            href="#"
            className="text-[#344E41] text-sm font-bold leading-6 hover:underline transition"
          >
            Learn how to recycle →
          </a>
        </div>

       
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      
          <div className="w-full max-w-[252px] rounded-xl border border-[#EBE9E8] bg-white overflow-hidden">
            <div className="h-[146px] flex items-center justify-center bg-[#E9FFFD]">
              <img src={PlasticIcon} alt="Plastic" className="w-12 h-12" />
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold text-black">Plastic</h3>

              <div className="mt-2 space-y-1 text-sm">
                <p className="text-green-600 flex items-center gap-2">✔ Bottles & Jars</p>
                <p className="text-red-500 flex items-center gap-2">✖ Plastic Bags</p>
              </div>
            </div>
          </div>

        
          <div className="w-full max-w-[252px] rounded-xl border border-[#EBE9E8] bg-white overflow-hidden">
            <div className="h-[146px] flex items-center justify-center bg-[#FFF7ED]">
              <img src={PaperIcon} alt="Paper" className="w-12 h-12" />
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold text-black">Paper</h3>

              <div className="mt-2 space-y-1 text-sm">
                <p className="text-green-600 flex items-center gap-2">✔ Newspaper/Cardboard</p>
                <p className="text-red-500 flex items-center gap-2">✖ Soiled Pizza Boxes</p>
              </div>
            </div>
          </div>

        
          <div className="w-full max-w-[252px] rounded-xl border border-[#EBE9E8] bg-white overflow-hidden">
            <div className="h-[146px] flex items-center justify-center bg-[#F0FFFB]">
              <img src={GlassIcon} alt="Glass" className="w-12 h-12" />
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold text-black">Glass</h3>

              <div className="mt-2 space-y-1 text-sm">
                <p className="text-green-600 flex items-center gap-2">✔ Bottles & Jars</p>
                <p className="text-red-500 flex items-center gap-2">✖ Broken Mirrors</p>
              </div>
            </div>
          </div>

        
          <div className="w-full max-w-[252px] rounded-xl border border-[#EBE9E8] bg-white overflow-hidden">
            <div className="h-[146px] flex items-center justify-center bg-[#F5F3FF]">
              <img src={EwasteIcon} alt="E-waste" className="w-12 h-12" />
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold text-black">E-Waste</h3>

              <div className="mt-2 space-y-1 text-sm">
                <p className="text-green-600 flex items-center gap-2">✔ Old Phones & Monitors</p>
                <p className="text-red-500 flex items-center gap-2">✖ Batteries</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default KnowledgeHub
