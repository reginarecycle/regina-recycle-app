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
    <section id="home" className="relative w-full overflow-x-hidden bg-white py-16">
      {/* Figma green blurred ellipse */}
      <div className="pointer-events-none absolute left-[-113px] top-[32px] z-0 h-[371px] w-[371px] rounded-full bg-[#BBF7D0] opacity-45 blur-[48px]" />

      {/* tiny softening layer */}
      <div className="pointer-events-none absolute left-[-95px] top-[52px] z-0 h-[320px] w-[320px] rounded-full bg-[#BBF7D0] opacity-20 blur-[56px]" />

      {/* subtle bottom-left blur */}
      <div className="pointer-events-none absolute bottom-[18px] left-[-28px] z-0 h-[90px] w-[90px] rounded-full bg-[#344E41] opacity-10 blur-[18px]" />

      {/* subtle right decorative shape */}
      <div className="pointer-events-none absolute right-[-36px] top-[76px] z-0 opacity-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="189"
          viewBox="0 0 60 189"
          fill="none"
          className="h-[151px] w-[183px] rotate-[-102.58deg]"
        >
          <g filter="url(#filter0_f_131_4572)">
            <path
              d="M60.4869 4C50.7986 6.16254 41.7207 10.6139 33.7717 17.0999C25.8226 23.586 19.158 31.9796 14.1584 41.8017C9.1588 51.6238 5.92208 62.6819 4.63306 74.3447C3.34404 86.0075 4.02796 98.0466 6.64577 109.775C9.26358 121.503 13.764 132.69 19.8901 142.697C26.0162 152.705 33.648 161.337 42.3498 168.101C51.0516 174.865 60.6528 179.628 70.6055 182.118C80.5581 184.608 90.6672 184.777 100.356 182.614L90.0334 136.37C85.3618 137.413 80.4872 137.332 75.6882 136.131C70.8891 134.93 66.2594 132.634 62.0635 129.372C57.8676 126.111 54.1876 121.948 51.2337 117.123C48.2797 112.297 46.1097 106.903 44.8474 101.248C43.5851 95.5925 43.2553 89.7873 43.8769 84.1636C44.4984 78.5399 46.0591 73.2078 48.4699 68.4717C50.8807 63.7356 54.0943 59.6882 57.9272 56.5607C61.7602 53.4332 66.1375 51.2868 70.8091 50.244L60.4869 4Z"
              fill="#B5D7FA"
              fillOpacity="0.48"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_131_4572"
              x="0"
              y="0"
              width="104.355"
              height="188.12"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="2"
                result="effect1_foregroundBlur_131_4572"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-16">
        <div className="flex flex-col-reverse items-center justify-center gap-16 lg:flex-row">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex rounded-full bg-[#618171] px-4 py-1 text-sm font-bold leading-6 text-white">
              🎯 #1 Recycling App
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-black sm:text-6xl sm:leading-[72px]">
              Make Everyday Waste <br />
              Count{" "}
              <span className="text-[#618171]">
                {text}
                <span className="ml-1 inline-block w-[1ch] animate-pulse">|</span>.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-[612px] text-base font-normal leading-6 text-[#10131D] lg:mx-0">
              Track your recycling, learn what can be reused, and reduce everyday
              waste with an easy-to-use recycling platform designed for real life.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                className="
                  flex h-[48px] w-full items-center justify-center gap-2
                  rounded-lg border border-[#618171] bg-white px-4 py-2
                  text-base font-bold leading-6 text-[#344E41]
                  transition hover:bg-[#E8FFF2]
                  sm:w-[234px]
                "
              >
                Learn →
              </button>

              <button
                className="
                  flex h-[48px] w-full items-center justify-center gap-2
                  rounded-lg bg-[#344E41] px-4 py-2
                  text-base font-semibold leading-6 text-white
                  transition hover:bg-[#2F4F3F]
                  sm:w-[234px]
                "
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:w-[520px]">
            <img
              src={heroImage}
              alt="Recycling illustration"
              className="w-full max-w-[520px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;