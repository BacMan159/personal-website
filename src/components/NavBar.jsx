import React, {useEffect, useState} from 'react'
import {navLinks, socialImgs} from "../constants/index.js";

const NavBar = () => {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (!target) return;
        const offset = 130;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

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

                {socialImgs.filter(s => s.name === 'linkedin').map(s => (
                    <a key={s.name} className="icon" target="_blank" rel="noopener noreferrer" href={s.url}>
                        <img src={s.imgPath} alt="LinkedIn" />
                    </a>
                ))}
            </div>
        </header>
    )
}
export default NavBar
