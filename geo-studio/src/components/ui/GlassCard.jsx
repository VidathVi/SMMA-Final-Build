import React from 'react';
import './GlassCard.css';

/**
 * Reusable GlassCard component with glassmorphism effects.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Content to be rendered inside the card.
 * @param {string} props.className - Additional CSS classes.
 */
const GlassCard = ({ children, className = '', ...props }) => {
    return (
        <div className={`glass-card glass-effect ${className}`} {...props}>
            {children}
        </div>
    );
};

export default GlassCard;
