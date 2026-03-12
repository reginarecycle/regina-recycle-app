import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Is the service free to use?",
    answer:
      "Yes! The basic app features and drop-off locator are completely free. Home pickup services may incur a small fee depending on your area.",
  },
  {
    question: "How do I earn rewards?",
    answer:
      "Currently, we focus on household recyclables. For furniture, please check our 'Local Centers' map for specific drop-off points that accept bulk home items.",
  },
  {
    question: "How do I schedule a pickup?",
    answer:
      "Currently, we focus on household recyclables. For furniture, please check our 'Local Centers' map for specific drop-off points that accept bulk home items.",
  },
  {
    question: "Do you accept large furniture?",
    answer:
      "Currently, we focus on household recyclables. For furniture, please check our 'Local Centers' map for specific drop-off points that accept bulk home items.",
  },
];

function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="flex flex-col gap-2 items-center text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-black text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base">
            We answered questions so you don't have to ask them.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#f9fafb] rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] mb-4 px-5 border-none"
              >
                <AccordionTrigger className="text-base md:text-lg font-bold text-black hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-paragraph2 text-sm leading-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQSection;
