import React from 'react'
import { skills } from "../constants/index.js";

const SkillTag = React.memo(({ name }) => (
    <div className="flex-none flex-center marquee-item">
        <span className="px-5 py-2 rounded-full border border-black-50 bg-black-100 text-white-50 font-medium text-sm md:text-base whitespace-nowrap">
            {name}
        </span>
    </div>
))

const LogoSection = () => {
    const mid = Math.ceil(skills.length / 2);
    const offsetSkills = [...skills.slice(mid), ...skills.slice(0, mid)];

    return (
        <div className="md:my-20 my-10 relative">
            <div className="gradient-edge" />
            <div className="gradient-edge" />

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
    )
}
export default LogoSection
