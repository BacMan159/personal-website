import Button from "../components/Button.jsx";
import HeroExperience from "../components/HeroModels/HeroExperience.jsx";
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Hero = () => {

    useGSAP(() => {
        gsap.fromTo('.hero-text h1', {
            y: 50,
            opacity: 0,
        },{
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: 'power2.inOut',
            },
        )
    }, [])
    return (
        <section id= "hero" className="relative overflow-hidden">
            <div className="absolute top-0 left-0 z-0">
                <img src="/images/bg.png" alt="background" />
            </div>

            <div className="hero-layout">
                {/* Hero Text */}
                <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
                    <div className="flex flex-col gap-7">
                        <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">With over 8 years of experience in building scalable, cloud-native applications across aviation, healthcare, e-commerce, and financial services </p>
                        <div className="flex items-stretch gap-5">
                            <Button className="md:w-80 w-60" id="button" text="See My Work"/>
                            <a
                                href="/Bhasanth_Lakkaraju_Resume.pdf"
                                download
                                className="group relative z-20 flex items-center justify-center w-12 md:w-16 rounded-lg border border-white-50 bg-transparent transition-all duration-300 hover:bg-white-50 cursor-pointer"
                            >
                                <img src="/images/download_resume.svg" alt="download" className="w-[25px] h-[25px] invert group-hover:invert-0 transition-all duration-300" />
                                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-black text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    Download Resume
                                </span>
                            </a>
                        </div>
                    </div>

                </header>
                {/* Hero 3D */}
                <figure>
                    <div className="hero-3d-layout">
                        <HeroExperience/>
                    </div>
                </figure>
            </div>
        </section>
    )
}
export default Hero
