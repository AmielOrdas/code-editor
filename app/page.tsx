import Navbar from "@/components/Home Page/Navbar";
import MultiCardLayout from "../components/Home Page/Multicard";
import WelcomeArea from "../components/Home Page/WelcomeArea";
import AnimationWrapper from "@/components/wrappers/PageAnimation";
import Footer from "@/components/Home Page/Footer";
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
