import Hero from "./sections/Hero.jsx"
import NavBar from "./components/NavBar.jsx";
import AnimatedCounter from "./components/AnimatedCounter.jsx";
import FeatureCards from "./sections/FeatureCards.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import TechStack from "./sections/TechStack.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import LogoSection from "./sections/LogoSection.jsx";
import EducationGlobe from "./sections/EducationGlobe.jsx";

const App = () => {
    return (
        <main>
            <NavBar />
            <Hero />
            <AnimatedCounter />
            {/*<Showcase />*/}
            <FeatureCards />
            <ExperienceSection />
            <TechStack />
            <LogoSection />
            <EducationGlobe />
            <Contact />
            <Footer />
        </main>
    )
}
export default App
