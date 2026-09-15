'use client'

import React from 'react'

export type RobotState = 'idle' | 'unsubscribing' | 'broken' | 'healed'

interface BrokenHeartRobotProps {
  state: RobotState
  className?: string
  compact?: boolean
}

export default function BrokenHeartRobot({ state, className = '', compact = false }: BrokenHeartRobotProps) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <style jsx>{`
        @keyframes robotHeartBeat {
          0%, 100% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.12);
          }
          30% {
            transform: scale(1.02);
          }
          45% {
            transform: scale(1.1);
          }
        }

        @keyframes tearDrop {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.6);
          }
          20% {
            opacity: 1;
            transform: translateY(4px) scale(1);
          }
          80% {
            opacity: 0.9;
            transform: translateY(22px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(28px) scale(0.8);
          }
        }

        @keyframes tearDropRight {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.6);
          }
          30% {
            opacity: 1;
            transform: translateY(5px) scale(1);
          }
          85% {
            opacity: 0.9;
            transform: translateY(20px) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translateY(26px) scale(0.7);
          }
        }

        @keyframes brokenHeartLeft {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(-10px, 12px) rotate(-18deg);
          }
        }

        @keyframes brokenHeartRight {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(10px, 14px) rotate(20deg);
          }
        }

        @keyframes healSnap {
          0% {
            transform: scale(0.8);
            filter: drop-shadow(0 0 0px #00FF94);
          }
          50% {
            transform: scale(1.25);
            filter: drop-shadow(0 0 16px #00FF94);
          }
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 8px #00FF94);
          }
        }

        @keyframes antennaGlitch {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes antennaDroop {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(26deg); }
        }

        @keyframes radioPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .anim-heartbeat {
          transform-origin: 100px 145px;
          animation: robotHeartBeat 1.8s infinite ease-in-out;
        }

        .anim-tear-left {
          animation: tearDrop 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        .anim-tear-right {
          animation: tearDropRight 2.1s infinite 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .anim-broken-left {
          transform-origin: 90px 145px;
          animation: brokenHeartLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-broken-right {
          transform-origin: 110px 145px;
          animation: brokenHeartRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-healed {
          transform-origin: 100px 145px;
          animation: healSnap 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, robotHeartBeat 2s infinite 0.6s ease-in-out;
        }

        .anim-droop {
          transform-origin: 100px 52px;
          animation: antennaDroop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-glitch {
          transform-origin: 100px 52px;
          animation: antennaGlitch 0.2s infinite ease-in-out;
        }
      `}</style>

      {/* SVG Robot Illustration */}
      <div className={`relative transition-all duration-300 ${compact ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-28 h-28 sm:w-36 sm:h-36'}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[4px_4px_0px_#000000]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radio Waves from Antenna Tip (Only when active/idle/healed) */}
          {state !== 'broken' && (
            <g opacity="0.8">
              <path
                d="M84 18 C88 14, 94 11, 100 11 C106 11, 112 14, 116 18"
                stroke="#00FF94"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="anim-radio-wave"
              />
              <path
                d="M76 12 C83 6, 91 3, 100 3 C109 3, 117 6, 124 12"
                stroke="#FFE600"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.6"
              />
            </g>
          )}

          {/* Antenna Assembly */}
          <g
            className={
              state === 'broken'
                ? 'anim-droop'
                : state === 'unsubscribing'
                ? 'anim-glitch'
                : ''
            }
          >
            {/* Antenna Mast */}
            <path
              d="M100 52 L100 24"
              stroke="#000000"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M100 52 L100 24"
              stroke={state === 'broken' ? '#888888' : '#FFE600'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Antenna Tip Bulb */}
            <circle
              cx="100"
              cy="22"
              r="7"
              fill={
                state === 'broken'
                  ? '#444444'
                  : state === 'healed'
                  ? '#00FF94'
                  : state === 'unsubscribing'
                  ? '#FF3131'
                  : '#00FF94'
              }
              stroke="#000000"
              strokeWidth="3"
            />
            {/* Sparks on Unsubscribing / Glitch */}
            {state === 'unsubscribing' && (
              <path
                d="M106 14 L114 18 L108 22 L116 26"
                stroke="#FFE600"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {state === 'broken' && (
              <path
                d="M108 26 L112 30"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Headphones Band */}
          <path
            d="M34 94 C34 50, 166 50, 166 94"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M34 94 C34 50, 166 50, 166 94"
            stroke={state === 'broken' ? '#333333' : '#FFE600'}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Left Headphone Ear-Cup */}
          <rect
            x="20"
            y="82"
            width="18"
            height="34"
            rx="5"
            fill={state === 'broken' ? '#222222' : '#FF3131'}
            stroke="#000000"
            strokeWidth="3.5"
          />
          <line
            x1="29"
            y1="88"
            x2="29"
            y2="110"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Headphone Ear-Cup */}
          <rect
            x="162"
            y="82"
            width="18"
            height="34"
            rx="5"
            fill={state === 'broken' ? '#222222' : '#FF3131'}
            stroke="#000000"
            strokeWidth="3.5"
          />
          <line
            x1="171"
            y1="88"
            x2="171"
            y2="110"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Main Head Chassis */}
          <rect
            x="38"
            y="52"
            width="124"
            height="80"
            rx="12"
            fill="#1A1A1A"
            stroke="#000000"
            strokeWidth="4"
          />

          {/* Corner Decal Screws */}
          <circle cx="46" cy="60" r="2.5" fill="#FFE600" stroke="#000" strokeWidth="1" />
          <circle cx="154" cy="60" r="2.5" fill="#FFE600" stroke="#000" strokeWidth="1" />
          <circle cx="46" cy="124" r="2.5" fill="#FFE600" stroke="#000" strokeWidth="1" />
          <circle cx="154" cy="124" r="2.5" fill="#FFE600" stroke="#000" strokeWidth="1" />

          {/* CRT Screen Display Bezel */}
          <rect
            x="48"
            y="62"
            width="104"
            height="60"
            rx="8"
            fill="#0A0A0A"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* CRT Scanline Accents */}
          <line x1="50" y1="72" x2="150" y2="72" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />
          <line x1="50" y1="82" x2="150" y2="82" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />
          <line x1="50" y1="92" x2="150" y2="92" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />
          <line x1="50" y1="102" x2="150" y2="102" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />
          <line x1="50" y1="112" x2="150" y2="112" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />

          {/* Robot Eyes & Mouth Expression */}
          {state === 'idle' && (
            <g>
              {/* Left Eye: Cheerful wide LED pixel */}
              <rect x="66" y="76" width="14" height="18" rx="3" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
              <rect x="69" y="78" width="4" height="4" rx="1" fill="#FFFFFF" />
              {/* Right Eye: Cheerful wide LED pixel */}
              <rect x="120" y="76" width="14" height="18" rx="3" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
              <rect x="123" y="78" width="4" height="4" rx="1" fill="#FFFFFF" />
              {/* Neutral / Curious Audio Speaker Mouth */}
              <rect x="88" y="104" width="24" height="4" rx="2" fill="#FFE600" stroke="#000" strokeWidth="1" />
            </g>
          )}

          {state === 'unsubscribing' && (
            <g>
              {/* Worried / Scanning Eyes */}
              <rect x="64" y="80" width="18" height="8" rx="2" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
              <rect x="118" y="80" width="18" height="8" rx="2" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
              {/* Trembling mouth */}
              <path
                d="M86 105 Q92 108, 100 105 T114 105"
                stroke="#FF3131"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {state === 'broken' && (
            <g>
              {/* Sad Drooping Angled Eyes */}
              <path
                d="M62 88 L78 80"
                stroke="#00EAFF"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M138 88 L122 80"
                stroke="#00EAFF"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Animated Digital Tears streaming down the glass */}
              <g className="anim-tear-left">
                <circle cx="70" cy="94" r="3.5" fill="#00EAFF" />
                <path d="M70 91 L70 95" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <g className="anim-tear-right">
                <circle cx="130" cy="94" r="3" fill="#00EAFF" />
                <path d="M130 91 L130 95" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Sad Inverted Speaker Mouth */}
              <path
                d="M86 109 Q100 99, 114 109"
                stroke="#FF3131"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {state === 'healed' && (
            <g>
              {/* Happy Heart Eyes (♥ ♥) */}
              <path
                d="M66 84 C66 79, 73 78, 73 83 C73 78, 80 79, 80 84 C80 89, 73 93, 73 95 C73 93, 66 89, 66 84 Z"
                fill="#00FF94"
                stroke="#000"
                strokeWidth="1.5"
              />
              <path
                d="M120 84 C120 79, 127 78, 127 83 C127 78, 134 79, 134 84 C134 89, 127 93, 127 95 C127 93, 120 89, 120 84 Z"
                fill="#00FF94"
                stroke="#000"
                strokeWidth="1.5"
              />
              {/* Cheerful Digital Smile */}
              <path
                d="M86 102 Q100 114, 114 102"
                stroke="#00FF94"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Neck Joint */}
          <rect
            x="88"
            y="132"
            width="24"
            height="8"
            rx="2"
            fill="#333333"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Body / Chest Console */}
          <rect
            x="54"
            y="140"
            width="92"
            height="52"
            rx="8"
            fill="#1A1A1A"
            stroke="#000000"
            strokeWidth="4"
          />

          {/* Chest Heart Cavity Bezel */}
          <rect
            x="76"
            y="146"
            width="48"
            height="40"
            rx="6"
            fill="#0A0A0A"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* Side Equalizer / VU Meter Bars on Chest */}
          <g opacity="0.8">
            <rect x="62" y="152" width="6" height="3" fill="#00FF94" stroke="#000" strokeWidth="1" />
            <rect x="62" y="158" width="6" height="3" fill="#00FF94" stroke="#000" strokeWidth="1" />
            <rect x="62" y="164" width="6" height="3" fill="#FFE600" stroke="#000" strokeWidth="1" />
            <rect x="62" y="170" width="6" height="3" fill={state === 'broken' ? '#444444' : '#FF3131'} stroke="#000" strokeWidth="1" />

            <rect x="132" y="152" width="6" height="3" fill="#00FF94" stroke="#000" strokeWidth="1" />
            <rect x="132" y="158" width="6" height="3" fill="#00FF94" stroke="#000" strokeWidth="1" />
            <rect x="132" y="164" width="6" height="3" fill="#FFE600" stroke="#000" strokeWidth="1" />
            <rect x="132" y="170" width="6" height="3" fill={state === 'broken' ? '#444444' : '#FF3131'} stroke="#000" strokeWidth="1" />
          </g>

          {/* The Heart Mechanism in Chest */}
          {state === 'idle' && (
            <g className="anim-heartbeat">
              <path
                d="M100 174 C96 170, 85 160, 85 155 C85 149.5, 90.5 146, 95 148.5 C98 150, 100 152, 100 152 C100 152, 102 150, 105 148.5 C109.5 146, 115 149.5, 115 155 C115 160, 104 170, 100 174 Z"
                fill="#FF3131"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="94" cy="153" r="1.5" fill="#FFFFFF" opacity="0.8" />
            </g>
          )}

          {state === 'unsubscribing' && (
            <g className="anim-heartbeat">
              <path
                d="M100 174 C96 170, 85 160, 85 155 C85 149.5, 90.5 146, 95 148.5 C98 150, 100 152, 100 152 C100 152, 102 150, 105 148.5 C109.5 146, 115 149.5, 115 155 C115 160, 104 170, 100 174 Z"
                fill="#FF5C00"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>
          )}

          {state === 'broken' && (
            <g>
              {/* Left Broken Heart Half */}
              <g className="anim-broken-left">
                <path
                  d="M100 174 L98 168 L101 163 L97 157 L100 152 C100 152, 98 150, 95 148.5 C90.5 146, 85 149.5, 85 155 C85 160, 96 170, 100 174 Z"
                  fill="#FF3131"
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </g>

              {/* Right Broken Heart Half */}
              <g className="anim-broken-right">
                <path
                  d="M100 174 L102 168 L99 163 L103 157 L100 152 C100 152, 102 150, 105 148.5 C109.5 146, 115 149.5, 115 155 C115 160, 104 170, 100 174 Z"
                  fill="#FF3131"
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </g>

              {/* Micro Break Spark Particles */}
              <circle cx="96" cy="178" r="1.5" fill="#FFE600" opacity="0.8" />
              <circle cx="104" cy="180" r="1.5" fill="#00EAFF" opacity="0.8" />
              <line x1="99" y1="155" x2="101" y2="167" stroke="#FFE600" strokeWidth="1" strokeDasharray="1 2" />
            </g>
          )}

          {state === 'healed' && (
            <g className="anim-healed">
              {/* Perfectly Repaired Glowing Neon Green Heart */}
              <path
                d="M100 174 C96 170, 85 160, 85 155 C85 149.5, 90.5 146, 95 148.5 C98 150, 100 152, 100 152 C100 152, 102 150, 105 148.5 C109.5 146, 115 149.5, 115 155 C115 160, 104 170, 100 174 Z"
                fill="#00FF94"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="94" cy="153" r="1.5" fill="#FFFFFF" />
            </g>
          )}
        </svg>
      </div>

      {/* Dynamic Robot Speech Bubble in English */}
      <div className={`relative ${compact ? 'mt-1.5' : 'mt-2.5'} max-w-sm`}>
        <div
          className={`px-3 py-1.5 border-2 border-black font-black uppercase tracking-wider ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-[11px]'} text-center shadow-[2px_2px_0px_#000000] transition-all duration-300 ${
            state === 'broken'
              ? 'bg-[#FF3131] text-white shadow-[3px_3px_0px_#00EAFF]'
              : state === 'healed'
              ? 'bg-[#00FF94] text-black shadow-[3px_3px_0px_#FFE600]'
              : state === 'unsubscribing'
              ? 'bg-[#FFE600] text-black'
              : 'bg-[#1e1e1e] text-zinc-200 border-zinc-700'
          }`}
        >
          {state === 'idle' && (
            <span>Are you sure you want to disconnect from the studio? 🥺</span>
          )}
          {state === 'unsubscribing' && (
            <span>Disconnecting audio cables & feeds... 🔌</span>
          )}
          {state === 'broken' && (
            <span>Beep boop... Audio circuits broken! 💔 We will miss your beats!</span>
          )}
          {state === 'healed' && (
            <span>Circuits repaired! Welcome back to the sound vault! 🎧</span>
          )}
        </div>
      </div>
    </div>
  )
}
