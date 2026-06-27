import React from 'react'
import { motion } from 'framer-motion'
import { skills } from '../constants/index.js'
import Reveal from '../components/Reveal.jsx'

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
                <Reveal as="h2" className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Skills
                </Reveal>
                <Reveal as="p" delay={0.05} className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
                    Tools and Credentials
                </Reveal>

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

            <div className="relative mt-16 w-screen left-1/2 -translate-x-1/2">
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
        </section>
    )
}

export default Skills
