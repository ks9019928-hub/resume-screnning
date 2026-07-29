import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import SearchChanged from "../components/sections/SearchChanged";
import Mission from "../components/sections/Mission";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <SearchChanged />
      <Mission />
    </main>
  );
}