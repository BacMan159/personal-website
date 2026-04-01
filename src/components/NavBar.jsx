import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { navLinks, socialImgs } from "../constants/index.js";

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 10);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToSection = useCallback((e, id) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (!target) return;
        const offset = 130;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }, []);

    const linkedin = useMemo(() => socialImgs.find(s => s.name === 'linkedin'), []);

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
            <div className="inner">
                <a className="logo" href="#hero" onClick={(e) => scrollToSection(e, 'hero')}>
                    Bhasanth
                </a>

                <nav className="desktop">
                    <ul>
                        {navLinks.map(({ link, name }) => (
                            <li key={name} className="group">
                                <a href={link} onClick={(e) => scrollToSection(e, link.slice(1))}>
                                    <span>{name}</span>
                                    <span className="underline"/>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {linkedin && (
                    <a className="icon" target="_blank" rel="noopener noreferrer" href={linkedin.url}>
                        <img src={linkedin.imgPath} alt="LinkedIn" />
                    </a>
                )}
            </div>
        </header>
    )
}
export default NavBar
