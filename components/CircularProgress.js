"use client";

import { useState, useEffect } from "react";

export default function CircularProgress({ 
  percentage, 
  size = 60, 
  strokeWidth = 6, 
  color = "#4f46e5",
  bgColor = "#e0e7ff" 
}) {
  const [progress, setProgress] = useState(0);
  
  // Normalize percentage (between 0 and 100)
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  useEffect(() => {
    // Animate progress for smoother UI
    const timer = setTimeout(() => {
      setProgress(normalizedPercentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [normalizedPercentage]);
  
  // Calculate SVG parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (progress * circumference) / 100;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <div className="absolute text-center text-xs font-semibold" style={{ color }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
} 