import { useAuth } from "../context/AuthContext.jsx";
import NavBar from "../components/landing/NavBar.jsx";
import Hero from "../components/landing/Hero.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import AdmitCard from "../components/landing/AdmitCard.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function Landing() {
  const { accessToken } = useAuth();

  return (
    <main className="w-full bg-cream text-ink font-body">
      <NavBar accessToken={accessToken} />
      <Hero accessToken={accessToken} />
      <HowItWorks />
      <AdmitCard />
      <Footer />
    </main>
  );
}
