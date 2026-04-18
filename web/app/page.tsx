import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Business from "@/components/Business";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Business />
    </main>
  );
}