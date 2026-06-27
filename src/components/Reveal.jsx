import React from 'react'
import { motion } from 'framer-motion'

// Reveal: animate-in when the element's top crosses 80% of viewport height,
// animate-out (reverse) when scrolled past in either direction. Reversible
// both ways because viewport.once is omitted.
// Smooth cubic-bezier — easeOutQuart-ish, decelerates softly without overshoot.
const SMOOTH_EASE = [0.22, 1, 0.36, 1]

const Reveal = ({
    as: Tag = 'div',
    delay = 0,
    y = 48,
    duration = 1,
    className,
    style,
    children,
    ...rest
}) => {
    const MotionTag = motion[Tag] || motion.div
    return (
        <MotionTag
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y }}
            viewport={{ margin: '-10% 0px -20% 0px', amount: 0 }}
            transition={{ duration, ease: SMOOTH_EASE, delay }}
            className={className}
            style={style}
            {...rest}
        >
            {children}
        </MotionTag>
    )
}

export default Reveal
