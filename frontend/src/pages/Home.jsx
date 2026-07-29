import Navbar from "../components/layout/Navbar";import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import SearchChanged from "../components/sections/SearchChanged";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <SearchChanged />
    </main>
  );
}

