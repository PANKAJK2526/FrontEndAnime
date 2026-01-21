import SmoothWrapper from '@/components/SmoothWrapper'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  return (
    <SmoothWrapper>
      <HeroSection />
      <section className="h-screen bg-black" />
    </SmoothWrapper>
  )
}
