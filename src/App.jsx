import { lazy, Suspense } from "react";
import Hero from "./sections/Hero.jsx";
import NavBar from "./components/NavBar.jsx";
import AnimatedCounter from "./components/AnimatedCounter.jsx";
import PageLoader from "./components/PageLoader.jsx";

const FeatureCards      = lazy(() => import("./sections/FeatureCards.jsx"));
const ExperienceSection = lazy(() => import("./sections/ExperienceSection.jsx"));
const TechStack         = lazy(() => import("./sections/TechStack.jsx"));
const LogoSection       = lazy(() => import("./sections/LogoSection.jsx"));
const EducationGlobe    = lazy(() => import("./sections/EducationGlobe.jsx"));
const Contact           = lazy(() => import("./sections/Contact.jsx"));
const Footer            = lazy(() => import("./sections/Footer.jsx"));

const App = () => {
    return (
        <main>
            <NavBar />
            <Hero />
            <AnimatedCounter />
            <Suspense fallback={<PageLoader />}>
                <FeatureCards />
                <ExperienceSection />
                <TechStack />
                <LogoSection />
                <EducationGlobe />
                <Contact />
                <Footer />
            </Suspense>
        </main>
    )
}
export default App
