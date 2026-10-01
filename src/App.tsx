import Navbar from "./components/Navbar";
import EntertainmentExperience from "./components/EntertainmentExperience";
import Hero from "./components/Hero";
import SmartTVStreaming from "./components/SmartTVStreaming";
import StreamingBenefits from "./components/StreamingBenefits";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <StreamingBenefits />
        <EntertainmentExperience />
        <SmartTVStreaming />
      </main>
    </>
  );
}
