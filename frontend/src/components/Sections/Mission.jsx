import { motion } from "framer-motion";

const MISSION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4";

function AnimatedText({ text }) {
  const words = text.split(" ");

  return (
    <p className="flex flex-wrap justify-center gap-x-3 gap-y-4 text-center leading-relaxed text-2xl md:text-3xl lg:text-4xl font-light max-w-5xl mx-auto">
      {words.map((word, index) => {
        const highlight = [
          "curiosity",
          "clarity",
          "meaningful",
          "community",
          "insight",
          "noise",
          "meaning"
        ].includes(word.replace(",", "").replace(".", ""));

        return (
          <motion.span
            key={index}
            initial={{
              opacity: 0.15,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.05,
              duration: 0.45,
            }}
            className={
              highlight
                ? "text-white font-medium"
                : "text-white/40"
            }
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}

export default function Mission() {
  return (
    <section
      id="philosophy"
      className="bg-black py-40 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center text-5xl md:text-7xl font-semibold"
        >
          Our Mission
        </motion.h2>

        {/* Square Video */}

        <motion.div
          initial={{
            opacity: 0,
            scale: .92,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: .8,
          }}
          className="mt-20 flex justify-center"
        >
          <div className="overflow-hidden rounded-[40px] border border-white/10 w-full max-w-[800px] aspect-square">

            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src={MISSION_VIDEO}
                type="video/mp4"
              />
            </video>

          </div>
        </motion.div>

        {/* Paragraph One */}

        <div className="mt-24">

          <AnimatedText
            text="We believe curiosity begins every meaningful conversation. Clarity emerges when ideas are shared thoughtfully, distractions disappear, and knowledge becomes something people genuinely enjoy exploring."
          />

        </div>

        {/* Paragraph Two */}

        <div className="mt-20">

          <AnimatedText
            text="Mindloop exists to build a community driven by insight where there is less noise, deeper thinking, stronger connections, and more meaning in everything we read and write."
          />

        </div>

      </div>
    </section>
  );
}