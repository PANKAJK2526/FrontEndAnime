import SmoothWrapper from '@/components/SmoothWrapper'
import HeroSection from '@/components/HeroSection'
import TopBar from "@/components/TopBar"

export default function Home() {
  return (
    <SmoothWrapper>
      <TopBar />
      <HeroSection />
      <section className="h-screen bg-black" />
    </SmoothWrapper>
  )
}
