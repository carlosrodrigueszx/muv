import { Navbar, type NavLink } from "../components/ui/Navbar";
import {
  Hero,
  AudienceCards,
  ValueBanner,
  HowItWorksSection,
  DriverSection,
  FaqSection,
  Footer,
} from "../features/landing";

const landingLinks: NavLink[] = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para motoristas", href: "#motoristas" },
  { label: "Dúvidas", href: "#duvidas" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans antialiased">
      <Navbar links={landingLinks} showAuthButtons={true} />
      <main>
        <Hero />
        <AudienceCards />
        <ValueBanner />
        <HowItWorksSection />
        <DriverSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
