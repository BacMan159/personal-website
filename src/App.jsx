import { useEffect, useState } from "react";
import Hero from "./sections/Hero.jsx";
import NavBar from "./components/NavBar.jsx";
import PageLoader from "./components/PageLoader.jsx";
import HeroBackground from "./components/HeroBackground.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import { initThemeFromStorage } from "./components/ThemeToggle.jsx";
import { useLenis } from "./hooks/useLenis.js";
import "lenis/dist/lenis.css";
import Timeline from "./sections/Timeline.jsx";
import Projects from "./sections/Projects.jsx";
import Skills from "./sections/Skills.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";

const App = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => { initThemeFromStorage() }, []);
    useEffect(() => {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
        window.scrollTo(0, 0)
    }, []);
    useLenis();

    return (
        <>
            {loading && <PageLoader onDone={() => setLoading(false)} />}
            <ScrollProgress />
            <CustomCursor />
            <HeroBackground />
            <main className="bl-stage">
                <NavBar />
                <Hero />
                <div aria-hidden="true" className="bl-section-gap" />
                <Timeline />
                <div aria-hidden="true" className="bl-section-gap" />
                <Projects />
                <div aria-hidden="true" className="bl-section-gap" />
                <Skills />
                <div aria-hidden="true" className="bl-section-gap" />
                <Contact />
                <Footer />
            </main>
        </>
    )
}

export default App
