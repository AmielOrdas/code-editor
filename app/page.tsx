import Navbar from "@/components/Navbar";
import MultiCardLayout from "../components/Multicard";
import WelcomeArea from "../components/WelcomeArea";
import AnimationWrapper from "@/components/PageAnimationWrapper";
export default function Home() {
  return (
    <AnimationWrapper>
      <div>
        <Navbar />
        <WelcomeArea />
        <MultiCardLayout />
      </div>
    </AnimationWrapper>
  );
}
