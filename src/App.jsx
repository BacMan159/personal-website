import Hero from "./sections/Hero.jsx"
import Showcase from "./sections/Showcase.jsx";
import NavBar from "./components/NavBar.jsx";
import LogoSection from "./sections/LogoSection.jsx";
import AnimatedCounter from "./components/AnimatedCounter.jsx";
import FeatureCards from "./sections/FeatureCards.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";

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
        </main>
    )
}
export default App
