import Navbar from "@/components/Navbar";
import MultiCardLayout from "../components/Multicard";
import WelcomeArea from "../components/WelcomeArea";
import AnimationWrapper from "@/components/wrappers/PageAnimation";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <AnimationWrapper>
      <div>
        <Navbar />
        <WelcomeArea />
        <MultiCardLayout />
        <Footer />
      </div>
    </AnimationWrapper>
  );
}
