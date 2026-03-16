import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ContentCardProps {
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  bgColor: string;
  order?: "image-first" | "content-first";
  delay?: number;
  onButtonClick?: () => void;
}

const ContentCard = ({
  title,
  description,
  buttonText,
  imageSrc,
  bgColor,
  order = "image-first",
  delay = 0,
  onButtonClick,
}: ContentCardProps) => {
  const isContentFirst = order === "content-first";

  return (
    <motion.div
      className={`grid items-center gap-5 lg:gap-7 ${
        isContentFirst
          ? "lg:grid-cols-[1fr_1.47fr]"
          : "lg:grid-cols-[1.47fr_1fr]"
      }`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {/* Image */}
      <div
        className={`relative h-75 overflow-hidden rounded-xl md:h-87.5 lg:h-100 ${
          isContentFirst ? "order-1 lg:order-2" : "order-1"
        }`}
      >
        <img
          alt={title}
          src={imageSrc}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div
        className={`${bgColor} flex min-h-75 flex-col gap-7 rounded-xl p-6 shadow-sm lg:h-100 ${
          isContentFirst ? "order-2 lg:order-1" : "order-2"
        }`}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold leading-snug text-black md:text-3xl">
            {title}
          </h3>
          <p className="text-base leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onButtonClick}
          className="w-fit text-primary hover:bg-transparent hover:text-primary/80 px-0"
        >
          {buttonText}
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ContentCard;
