import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Fleet from "@/components/Fleet";
import Reservation from "@/components/Reservation";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Fleet />
      <Reservation />
      <Footer />
    </main>
  );
}
