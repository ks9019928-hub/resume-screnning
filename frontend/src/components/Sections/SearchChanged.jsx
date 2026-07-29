import { motion } from "framer-motion";

import chatgpt from "../../assets/icons/icon-chatgpt.png";
import perplexity from "../../assets/icons/icon-perplexity.png";
import google from "../../assets/icons/icon-google.png";

const cards = [
  {
    image: chatgpt,
    title: "ChatGPT",
    description:
      "AI-first conversations have replaced traditional search for millions of users."
  },
  {
    image: perplexity,
    title: "Perplexity",
    description:
      "Instant answers backed by sources are redefining how information is discovered."
  },
  {
    image: google,
    title: "Google AI",
    description:
      "Search is becoming conversational, contextual and deeply personalized."
  }
];

function PlatformCard({ image, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{
        y: -8,
        borderColor: "rgba(255,255,255,.2)"
      }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center transition-all"
    >
      <img
        src={image}
        alt={title}
        className="w-40 h-40 object-contain mx-auto"
      />

      <h3 className="mt-8 text-2xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 text-white/60 leading-7">
        {description}
      </p>
    </motion.div>
  );
}

export default function SearchChanged() {
  return (
    <section
      id="how-it-works"
      className="bg-black py-36 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center font-semibold leading-tight text-5xl md:text-7xl"
        >
          Search has{" "}
          <span className="font-serif italic">
            changed.
          </span>

          <br />

          Have you?
        </motion.h2>

        {/* Subtitle */}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .2 }}
          className="mx-auto mt-10 max-w-3xl text-center text-xl leading-9 text-white/65"
        >
          The internet is evolving. Traditional search is giving way to
          intelligent conversations, contextual discovery, and AI-assisted
          learning. The question is no longer whether search has changed—
          it's whether your content has adapted.
        </motion.p>

        {/* Cards */}

        <div className="mt-24 grid gap-8 md:grid-cols-3">

          {cards.map((card, index) => (
            <PlatformCard
              key={card.title}
              {...card}
              delay={index * 0.15}
            />
          ))}

        </div>

        {/* Quote */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .3 }}
          className="mt-28"
        >
          <p className="mx-auto max-w-4xl text-center text-3xl md:text-5xl font-light leading-relaxed text-white/90">
            “If you don't answer the questions,
            <br />
            someone else will.”
          </p>
        </motion.div>

      </div>
    </section>
  );
}
