import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Business from "@/components/Business";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import News from "@/components/News";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Business />
      <Projects />
      <News />
      <Contact />
      <Footer />
    </main>
  );
}