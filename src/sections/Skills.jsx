import { motion } from 'framer-motion'
import React from 'react'
import Reveal from '../components/Reveal.jsx'
import { skills } from '../constants/index.js'

const CERTS = [
    {
        name: 'AWS Certified Solutions Architect – Associate',
        badge: '/images/badges/SAABadge.png',
        credly: 'https://www.credly.com/users/bhasanth-lakkaraju',
    },
    {
        name: 'AWS Certified AI Practitioner',
        badge: '/images/badges/AIPractitionerBadge.png',
        credly: 'https://www.credly.com/users/bhasanth-lakkaraju',
    },
    {
        name: 'AWS Agentic AI Demonstrated – Microcredential',
        badge: '/images/badges/AgenticBadge.png',
        credly: 'https://www.credly.com/users/bhasanth-lakkaraju',
    },
    {
        name: 'AWS Serverless Demonstrated – Microcredential',
        badge: '/images/badges/ServerlessBadge.png',
        credly: 'https://www.credly.com/users/bhasanth-lakkaraju',
    },
]

const SkillTag = React.memo(({ name }) => (
    <div className="flex-none flex-center marquee-item">
        <span className="bl-pill !py-2 !px-[18px] !text-sm whitespace-nowrap">
            {name}
        </span>
    </div>
))

const Skills = () => {
    const mid = Math.ceil(skills.length / 2)
    const offsetSkills = [...skills.slice(mid), ...skills.slice(0, mid)]

    return (
        <section id="skills" className="bl-stage section-padding">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-center md:justify-start mb-10">
                    <Reveal as="h2" className="bl-card !rounded-full inline-block px-8 py-3 md:px-10 md:py-4 text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Skills
                    </Reveal>
                </div>

                <div className="bl-card px-6 py-10 md:px-14 md:py-14">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    {CERTS.map((c, i) => (
                        <motion.a
                            key={c.name}
                            href={c.credly}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${c.name} on Credly`}
                            initial={{ opacity: 0, y: 48 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 48 }}
                            viewport={{ margin: '-10% 0px -20% 0px', amount: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                            whileHover={{ scale: 1.06 }}
                            className="block"
                        >
                            <img
                                src={c.badge}
                                alt={c.name}
                                loading="lazy"
                                className="w-24 h-24 md:w-40 md:h-40 object-contain"
                            />
                        </motion.a>
                    ))}
                </div>

            </div>

            <div className="relative mt-16 -mx-5 md:-mx-10">
                    <div className="marquee h-20">
                        <div className="marquee-box">
                            {skills.map((skill) => (
                                <SkillTag key={skill} name={skill} />
                            ))}
                            {skills.map((skill) => (
                                <SkillTag key={`${skill}-copy`} name={skill} />
                            ))}
                        </div>
                    </div>
                    <div className="marquee h-20">
                        <div className="marquee-box">
                            {offsetSkills.map((skill) => (
                                <SkillTag key={skill} name={skill} />
                            ))}
                            {offsetSkills.map((skill) => (
                                <SkillTag key={`${skill}-copy`} name={skill} />
                            ))}
                        </div>
                    </div>
            </div>
            </div>
        </section>
    )
}

export default Skills
