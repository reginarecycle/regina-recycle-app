import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "Is the service free to use?",
    answer:
      "Yes! The basic app features and drop-off locator are completely free. Home pickup services may incur a small fee depending on your area.",
  },
  {
    question: "How do I earn rewards?",
    answer:
      "Currently, we focus on household recyclables. For furniture, please check our 'Local Centers' map for specific drop-off points that accept bulk home",
  },
  {
    question: "How do I schedule a pickup?",
    answer:
      "Currently, we focus on household recyclables. For furniture, please check our 'Local Centers' map for specific drop-off points that accept bulk home",
  },
  {
    question: "Do you accept large furniture?",
    answer:
      "Currently, we focus on household recyclables. For furniture, please check our 'Local Centers' map for specific drop-off points that accept bulk home",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  };

  return (
    <section id="faqs" className="w-full bg-white py-20 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-[30px] font-black leading-[38px] text-black">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-[#999CA0] text-base leading-6">
            We answered questions so you don&apos;t have to ask them.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={item.question}
                className="
                  rounded-xl
                  bg-[#FBFBFB]
                  border border-[#EBE9E8]
                  shadow-[0_0_4px_rgba(0,0,0,0.06)]
                  overflow-hidden
                "
              >

                <div
                  onClick={() => toggle(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggle(idx);
                  }}
                  className="
                    w-full
                    px-6 py-5
                    flex items-center justify-between
                    text-left
                    cursor-pointer
                    select-none
                  "
                >
                  <span className="text-[#10131D] text-base font-bold leading-6">
                    {item.question}
                  </span>

                  <span
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-[#10131D]"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-[#999CA0] text-sm leading-6">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
