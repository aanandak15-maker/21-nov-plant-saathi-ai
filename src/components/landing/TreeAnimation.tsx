import React from 'react';
import { motion } from 'framer-motion';

export const TreeAnimation = () => {
    return (
        <div className="relative w-full h-[600px] flex justify-center items-end overflow-hidden">
            <svg
                viewBox="0 0 400 600"
                className="w-full h-full max-w-2xl"
                preserveAspectRatio="xMidYMax meet"
            >
                {/* Main Trunk */}
                <motion.path
                    d="M200,600 L200,400 Q200,380 195,360 L190,340"
                    fill="none"
                    stroke="#654321"
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Left Main Branch */}
                <motion.path
                    d="M190,340 Q160,320 140,300 Q130,290 120,280"
                    fill="none"
                    stroke="#654321"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
                />

                {/* Right Main Branch */}
                <motion.path
                    d="M195,350 Q220,330 240,310 Q255,295 270,280"
                    fill="none"
                    stroke="#654321"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.1, duration: 1.2, ease: "easeInOut" }}
                />

                {/* Left Secondary Branches */}
                <motion.path
                    d="M120,280 Q100,260 90,240"
                    fill="none"
                    stroke="#8B6914"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                />

                <motion.path
                    d="M130,290 Q115,275 105,260"
                    fill="none"
                    stroke="#8B6914"
                    strokeWidth="7"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.9, duration: 0.8 }}
                />

                {/* Right Secondary Branches */}
                <motion.path
                    d="M270,280 Q290,260 305,240"
                    fill="none"
                    stroke="#8B6914"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                />

                <motion.path
                    d="M260,290 Q275,270 285,250"
                    fill="none"
                    stroke="#8B6914"
                    strokeWidth="7"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.9, duration: 0.8 }}
                />

                {/* Top Central Branch */}
                <motion.path
                    d="M195,360 Q200,340 200,320 Q200,300 200,280 Q200,260 200,240"
                    fill="none"
                    stroke="#654321"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.3, duration: 1.2, ease: "easeInOut" }}
                />

                {/* Small tertiary branches */}
                <motion.path d="M200,280 Q210,270 215,260" fill="none" stroke="#8B6914" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.2, duration: 0.6 }} />
                <motion.path d="M200,270 Q190,260 185,250" fill="none" stroke="#8B6914" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.3, duration: 0.6 }} />

                {/* Foliage Clusters - Top of tree */}
                <motion.ellipse cx="200" cy="230" rx="45" ry="40" fill="#228B22" opacity="0.8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, duration: 0.6, type: "spring" }} />
                <motion.ellipse cx="180" cy="245" rx="35" ry="30" fill="#2E8B57" opacity="0.85" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.6, duration: 0.6, type: "spring" }} />
                <motion.ellipse cx="220" cy="245" rx="35" ry="30" fill="#2E8B57" opacity="0.85" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.7, duration: 0.6, type: "spring" }} />

                {/* Foliage - Left side */}
                <motion.ellipse cx="90" cy="240" rx="40" ry="35" fill="#32CD32" opacity="0.75" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.8, duration: 0.6, type: "spring" }} />
                <motion.ellipse cx="105" cy="260" rx="30" ry="25" fill="#3CB371" opacity="0.8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.9, duration: 0.6, type: "spring" }} />
                <motion.ellipse cx="120" cy="275" rx="35" ry="30" fill="#228B22" opacity="0.75" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.0, duration: 0.6, type: "spring" }} />

                {/* Foliage - Right side */}
                <motion.ellipse cx="305" cy="240" rx="40" ry="35" fill="#32CD32" opacity="0.75" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.8, duration: 0.6, type: "spring" }} />
                <motion.ellipse cx="285" cy="250" rx="30" ry="28" fill="#3CB371" opacity="0.8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.9, duration: 0.6, type: "spring" }} />
                <motion.ellipse cx="270" cy="275" rx="35" ry="30" fill="#228B22" opacity="0.75" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.0, duration: 0.6, type: "spring" }} />

                {/* Mid-level foliage */}
                <motion.ellipse cx="240" cy="305" rx="32" ry="28" fill="#2E8B57" opacity="0.8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1, duration: 0.6, type: "spring" }} />
                <motion.ellipse cx="160" cy="300" rx="30" ry="26" fill="#2E8B57" opacity="0.8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1, duration: 0.6, type: "spring" }} />

                {/* Additional depth foliage - darker shades in background */}
                <motion.ellipse cx="200" cy="265" rx="25" ry="22" fill="#1e6b1e" opacity="0.6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.65, duration: 0.5, type: "spring" }} />
                <motion.ellipse cx="150" cy="280" rx="20" ry="18" fill="#1e6b1e" opacity="0.6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.95, duration: 0.5, type: "spring" }} />
                <motion.ellipse cx="250" cy="280" rx="20" ry="18" fill="#1e6b1e" opacity="0.6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.95, duration: 0.5, type: "spring" }} />

                {/* Highlight leaves in foreground - lighter green */}
                <motion.ellipse cx="210" cy="240" rx="20" ry="18" fill="#90EE90" opacity="0.9" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.2, duration: 0.5, type: "spring" }} />
                <motion.ellipse cx="100" cy="255" rx="18" ry="16" fill="#90EE90" opacity="0.9" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.3, duration: 0.5, type: "spring" }} />
                <motion.ellipse cx="295" cy="255" rx="18" ry="16" fill="#90EE90" opacity="0.9" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.3, duration: 0.5, type: "spring" }} />

                {/* Trunk texture - vertical lines for bark */}
                <motion.line x1="195" y1="550" x2="195" y2="400" stroke="#4a3319" strokeWidth="1.5" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.5 }} />
                <motion.line x1="200" y1="550" x2="200" y2="400" stroke="#4a3319" strokeWidth="1" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 1.5 }} />
                <motion.line x1="205" y1="550" x2="205" y2="400" stroke="#4a3319" strokeWidth="1.5" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.0, duration: 1.5 }} />
            </svg>
        </div>
    );
};
