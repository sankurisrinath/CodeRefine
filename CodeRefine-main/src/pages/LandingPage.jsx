import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Architecture from '../components/Architecture'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Architecture />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPage
