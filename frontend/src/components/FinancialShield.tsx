'use client';
import React from 'react';

interface FinancialShieldProps {
  emergencyMonths: number;
  emergencyBalance: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function FinancialShield({
  emergencyMonths,
  emergencyBalance,
  size = 'md',
}: FinancialShieldProps) {
  const fillPercent = Math.min(100, (emergencyMonths / 3) * 100);
  const strength =
    emergencyMonths >= 3
      ? 'Strong'
      : emergencyMonths >= 2
      ? 'Healthy'
      : emergencyMonths >= 1
      ? 'Stable'
      : emergencyMonths >= 0.5
      ? 'Building'
      : emergencyMonths > 0
      ? 'Vulnerable' :'Critical';

  const shieldColor =
    strength === 'Strong' || strength === 'Healthy' ?'#4ADE80'
      : strength === 'Stable' ?'#60A5FA'
      : strength === 'Building' ?'#FBBF24'
      : strength === 'Vulnerable' ?'#FB923C' :'#F87171';

  const sizes = { sm: 80, md: 120, lg: 160 };
  const svgSize = sizes[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={size === 'lg' ? 'shield-pulse' : ''}>
        <svg width={svgSize} height={svgSize} viewBox="0 0 120 140" fill="none">
          <defs>
            <linearGradient id="shield-fill-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={shieldColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={shieldColor} stopOpacity="0.4" />
            </linearGradient>
            <clipPath id="shield-clip">
              <path d="M60 4 L110 24 L110 68 C110 96 86 118 60 130 C34 118 10 96 10 68 L10 24 Z" />
            </clipPath>
          </defs>

          {/* Shield outline */}
          <path
            d="M60 4 L110 24 L110 68 C110 96 86 118 60 130 C34 118 10 96 10 68 L10 24 Z"
            fill="rgba(255,255,255,0.04)"
            stroke={shieldColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Fill based on strength */}
          <rect
            x="10"
            y={130 - (126 * fillPercent) / 100}
            width="100"
            height={(126 * fillPercent) / 100}
            fill="url(#shield-fill-grad)"
            clipPath="url(#shield-clip)"
            opacity="0.7"
          />

          {/* Gloss overlay */}
          <path
            d="M60 4 L110 24 L110 68 C110 96 86 118 60 130 C34 118 10 96 10 68 L10 24 Z"
            fill="url(#shield-fill-grad)"
            opacity="0.06"
          />

          {/* Shield border glow */}
          <path
            d="M60 4 L110 24 L110 68 C110 96 86 118 60 130 C34 118 10 96 10 68 L10 24 Z"
            fill="none"
            stroke={shieldColor}
            strokeWidth="2"
            strokeOpacity="0.8"
          />

          {/* Center icon */}
          <text x="60" y="75" textAnchor="middle" fontSize="28" fill={shieldColor} opacity="0.9">
            🛡️
          </text>
        </svg>
      </div>

      <div className="text-center">
        <div className={`text-sm font-600 status-${strength.toLowerCase()}`}>{strength}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {emergencyMonths.toFixed(1)} months covered
        </div>
        {emergencyBalance > 0 && (
          <div className="font-mono text-xs text-muted-foreground mt-0.5">
            R{emergencyBalance.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
          </div>
        )}
      </div>
    </div>
  );
}