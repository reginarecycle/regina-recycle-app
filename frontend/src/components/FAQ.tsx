import { useState } from "react"

type FaqItem = {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: "Is the service free to use?",
    answer:
      "Yes! The basic app features and drop-off locator are completely free. Home pickup services may incur a small fee depending on your area.",
  },
  {
    question: "How do I earn rewards?",
    answer:
      "You earn rewards by completing recycling activities and tracking your progress in the app. Rewards availability can vary by program and location.",
  },
  {
    question: "How do I schedule a pickup?",
    answer:
      "Go to the pickup section, choose your address and preferred time window, then confirm. You’ll get a notification when a collector accepts.",
  },
  {
    question: "Do you accept large furniture?",
    answer:
      "Some large items can be accepted depending on local rules and capacity. Check the item in the Knowledge Hub or contact support for guidance.",
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx))
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-[30px] font-black leading-[38px] text-black">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-[#999CA0] text-base leading-6">
            We answered questions so you don&apos;t have to ask them.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-10 flex flex-col gap-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx

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
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="
                    w-full
                    px-6 py-5
                    flex items-center justify-between
                    text-left
                    cursor-pointer
                  "
                >
                  <span className="text-[#10131D] text-base font-bold leading-6">
                    {item.question}
                  </span>

                  {/* Chevron */}
                  <span
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-[#999CA0] text-sm leading-6">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
