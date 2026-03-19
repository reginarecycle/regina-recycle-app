import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";
import BinCharacter, { type Mood } from "@/components/ui/bin-character";
import { Button } from "../ui/button";
import { Routes } from "@/routes/routes";


const MOODS: Mood[] = ["normal", "happy", "sad", "surprised", "angry"];

const MOOD_DURATIONS: Record<Mood, number> = {
  normal:    10000,
  happy:     10000,
  sad:       10000,
  surprised: 10000,
  angry:     5000,
};

const MOOD_MESSAGES: Record<Mood, { headline: string; sub: string }> = {
  normal: {
    headline: "Oops! This page got recycled",
    sub: "Looks like this page doesn't exist. Maybe it was sorted into the wrong bin? Let's get you back to sorting properly!",
  },
  happy: {
    headline: "Hey, at least I'm still here!",
    sub: "The page is gone but I'm having a great time. Let me spin you back somewhere that actually exists!",
  },
  sad: {
    headline: "I can't find this page either...",
    sub: "I've looked everywhere and I'm pretty upset about it too. Let's go somewhere that actually exists.",
  },
  surprised: {
    headline: "WHAT?! Where did this page go?!",
    sub: "I was NOT expecting that. Neither was this URL. Let me help you find what you're looking for.",
  },
  angry: {
    headline: "This page does not exist. Period.",
    sub: "I don't know who told you it did, but they were wrong. Let's go back before I lose it completely.",
  },
};


export default function NotFoundPage() {
  const [moodIdx, setMoodIdx] = useState(0);
  const [fadeIn, setFadeIn]   = useState(true);
  const navigate = useNavigate();

  const mood = MOODS[moodIdx];
  const msg  = MOOD_MESSAGES[mood];

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        setMoodIdx((prev) => (prev + 1) % MOODS.length);
        setFadeIn(true);
      }, 400);
    }, MOOD_DURATIONS[mood]);

    return () => clearTimeout(timer);
  }, [mood]); 

  return (
       <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-12 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #2b4132 0%, #8aab95 25%, #b8d4be 60%, #ddeedd 100%)" }}

    >
      {/* ── Background 404 watermark ── */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black pointer-events-none select-none text-white/30 opacity-80 w-full text-center"
        style={{ fontSize: "clamp(100px, 80vw, 580px)", letterSpacing: "16px" }}
      >
        404
      </span>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl text-center">
        <div className="w-[clamp(160px,30vw,240px)] mb-5 drop-shadow-lg">
          <BinCharacter mood={mood} />
        </div>

        <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.4s ease" }}>
          <h2
            className="font-black text-foreground leading-tight mb-3"
            style={{ fontSize: "clamp(20px, 3.8vw, 36px)" }}
          >
            {msg.headline}
          </h2>
          <p className="text-black/80 leading-relaxed max-w-md mb-8 mx-auto text-sm md:text-base">
            {msg.sub}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Button  size="lg" onClick={()=> navigate(-1)} className="items-center gap-2 px-6 h-11">
            <Home size={15} />
            Go back
          </Button>
          <Button  size="lg" variant="outlineprimary" onClick={()=> navigate(Routes.learn)} className="items-center gap-2 px-6 h-11">
            <BookOpen size={15} />
            Learn to recycle
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 flex items-start gap-3 w-full max-w-md text-left shadow-sm">
          <span className="text-xl mt-0.5 shrink-0">♻️</span>
          <div>
            <p className="text-sm font-semibold text-paragraph2 mb-0.5">
              Fun fact while you're here
            </p>
            <p className="text-xs text-paragraph leading-relaxed">
              Recycling one aluminium can saves enough energy to power a laptop for 3 hours!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
