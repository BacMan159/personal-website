import { motion } from 'framer-motion'
import React from 'react'
import Reveal from '../components/Reveal.jsx'
import { skillCategories } from '../constants/index.js'

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

const ICONS = {
    certifications: (
        <path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3.5 1.6L7 21l5-2 5 2-1.5-4.4" strokeLinecap="round" strokeLinejoin="round" />
    ),
    frontend: (
        <>
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        </>
    ),
    backend: (
        <>
            <rect x="3" y="4" width="18" height="6" rx="1.5" />
            <rect x="3" y="14" width="18" height="6" rx="1.5" />
            <path d="M7 7h.01M7 17h.01" strokeLinecap="round" />
        </>
    ),
    data: (
        <>
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
            <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </>
    ),
    devops: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
}

const SectionIcon = ({ name }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="shrink-0"
        style={{ color: 'var(--accent)' }}
    >
        {ICONS[name]}
    </svg>
)

const SkillPill = React.memo(({ name }) => (
    <span className="bl-pill !py-2 !px-[18px] !text-sm whitespace-nowrap">{name}</span>
))

const CategoryCard = ({ title, icon, items, index }) => (
    <Reveal
        className="bl-card px-6 py-7 md:px-8 md:py-8"
        duration={0.8}
        delay={index * 0.08}
    >
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b" style={{ borderColor: 'var(--border-base)' }}>
            <SectionIcon name={icon} />
            <h3 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h3>
        </div>
        <div className="flex flex-wrap gap-3">
            {items.map((skill) => (
                <SkillPill key={skill} name={skill} />
            ))}
        </div>
    </Reveal>
)

const Skills = () => {
    return (
        <section id="skills" className="bl-stage section-padding">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-center md:justify-start mb-10">
                    <Reveal as="h2" className="bl-card !rounded-full inline-block px-8 py-3 md:px-10 md:py-4 text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Skills
                    </Reveal>
                </div>

                <div className="bl-card px-6 py-10 md:px-14 md:py-14 mb-8">
                    <div className="flex items-center gap-2.5 mb-7">
                        <SectionIcon name="certifications" />
                        <h3 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Certifications
                        </h3>
                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillCategories.map((category, index) => (
                        <CategoryCard key={category.title} index={index} {...category} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
