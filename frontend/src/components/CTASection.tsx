function CTASection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[32px] bg-[#344E41] px-8 py-16 text-center overflow-hidden">

         
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10" />

        
          <h2 className="text-white text-[36px] font-black leading-[44px]">
            Ready to make a difference?
          </h2>

          <p className="mt-4 text-white/80 text-base leading-6 max-w-[560px] mx-auto">
            Join thousands of Regina residents who are turning waste into opportunity.
            Start your journey towards a zero-waste lifestyle today.
          </p>

          <div className="mt-8 flex justify-center">
            <button className="px-8 py-3 rounded-lg border border-[#344E41] bg-white text-[#344E41] font-semibold shadow-[0_0_8px_rgba(0,0,0,0.30)] hover:scale-105 transition">
              Get Started
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CTASection
