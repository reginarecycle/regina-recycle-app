import { useEffect, useState } from "react";
import heroImage from "../assets/hero-image.svg";

const words = ["Reduce", "Reuse", "Recycle"];

function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = words[wordIndex % words.length];

    
    if (!deleting && text === full) {
      const t = setTimeout(() => setDeleting(true), 900);
      return () => clearTimeout(t);
    }

  
    if (deleting && text === "") {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
      return;
    }

    const next = deleting
      ? full.slice(0, text.length - 1)
      : full.slice(0, text.length + 1);

    const t = setTimeout(() => setText(next), deleting ? 45 : 80);
    return () => clearTimeout(t);
  }, [text, deleting, wordIndex]);

  return (
    <section className="w-full bg-gradient-to-r from-green-100 to-white py-16">
      
      <div className="w-full px-6 md:px-16 flex items-center justify-between">
      
        <div className="max-w-xl">
          <span className="bg-[#618171] text-white text-sm font-bold leading-6 px-4 py-1 rounded-full">
            #1 Recycling App
          </span>

          <h1 className="mt-6 text-6xl font-black leading-[72px] text-black">
            Make Everyday Waste <br />
            Count{" "}
            <span className="text-[#618171]">
              {text}
             
              <span className="ml-1 inline-block w-[1ch] animate-pulse">|</span>.
            </span>
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
            className="w-full max-w-[520px]"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
