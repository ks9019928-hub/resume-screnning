import { motion } from "framer-motion";

import avatar1 from "../../assets/avatars/avatar-1.png";
import avatar2 from "../../assets/avatars/avatar-2.png";
import avatar3 from "../../assets/avatars/avatar-3.png";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen overflow-hidden"
    >
      {/* Background Video */}

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/70" />

      {/* Bottom Gradient */}

      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Content */}

      <div className="relative z-10 flex h-full items-center justify-center px-6">

        <div className="mx-auto max-w-4xl text-center">

          {/* Avatars */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
            className="mb-8 flex justify-center"
          >
            <div className="flex -space-x-4">

              <img
                src={avatar1}
                className="h-14 w-14 rounded-full border-2 border-black object-cover"
              />

              <img
                src={avatar2}
                className="h-14 w-14 rounded-full border-2 border-black object-cover"
              />

              <img
                src={avatar3}
                className="h-14 w-14 rounded-full border-2 border-black object-cover"
              />

            </div>

            <span className="ml-5 flex items-center text-sm text-white/80">
              7,000+ people already subscribed
            </span>

          </motion.div>

          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            className="text-5xl font-semibold leading-tight md:text-7xl xl:text-8xl"
          >
            Get{" "}
            <span className="font-serif italic">
              Inspired
            </span>
            <br />
            with Us
          </motion.h1>

          {/* Subtitle */}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .45 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80 md:text-xl"
          >
            Thoughtful essays, curated knowledge,
            and meaningful conversations delivered
            directly to your inbox every week.
            Discover ideas worth remembering.
          </motion.p>

          {/* Email */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .65 }}
            className="mx-auto mt-12 flex max-w-xl items-center rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-2xl"
          >

            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-5 text-white placeholder:text-white/45 focus:outline-none"
            />

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: .95,
              }}
              className="rounded-full bg-white px-7 py-3 font-medium text-black"
            >
              Subscribe
            </motion.button>

          </motion.div>

        </div>

      </div>

    </section>
  );
}