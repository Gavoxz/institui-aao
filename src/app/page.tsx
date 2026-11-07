import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Identification, Institution, Platform, Services, Stats } from "@/components/site/Sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Institution />
        <Services />
        <Identification />
        <Platform />
      </main>
      <Footer />
    </>
  );
}
