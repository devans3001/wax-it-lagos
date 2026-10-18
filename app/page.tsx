import { Nav, Hero, Marquee, Proof, Services, MenuBoard, Gallery, Visit, Footer } from "@/components/Sections";
import Journey from "@/components/Journey";
import Compare from "@/components/Compare";
import Lab from "@/components/Lab";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="bg-cream text-cocoa antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <Proof />
      <Services />
      <Journey />
      <Compare />
      <Lab />
      <MenuBoard />
      <Testimonials />
      <Gallery />
      <Visit />
      <Footer />
    </main>
  );
}
