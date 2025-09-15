import Hero from "./sections/Hero.jsx"
import Showcase from "./sections/Showcase.jsx";
import NavBar from "./components/NavBar.jsx";
import LogoSection from "./sections/LogoSection.jsx";
import AnimatedCounter from "./components/AnimatedCounter.jsx";
import FeatureCards from "./sections/FeatureCards.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import TechStack from "./sections/TechStack.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";

const App = () => {
    return (
        <main>
            <NavBar />
            <Hero />
            <AnimatedCounter />
            <Showcase />
            <LogoSection />
            <FeatureCards />
            <ExperienceSection />
            <TechStack />
            <Contact />
            <Footer />
        </main>
    )
}
export default App
