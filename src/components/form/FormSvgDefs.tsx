import React from "react";

export function FormSvgDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="gNavy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A4F94" />
          <stop offset="1" stopColor="#0A1F45" />
        </linearGradient>
        <linearGradient id="gNavySide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0A1F45" />
          <stop offset="1" stopColor="#050F26" />
        </linearGradient>
        <linearGradient id="gSilver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FAFBFD" />
          <stop offset="1" stopColor="#B7C1CE" />
        </linearGradient>
        <linearGradient id="gTop" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#D3DCE8" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="gSky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D3E7FA" />
          <stop offset="1" stopColor="#86B3E3" />
        </linearGradient>
        <linearGradient id="gDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34405F" />
          <stop offset="1" stopColor="#0C111F" />
        </linearGradient>
        <linearGradient id="gJar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B9C4D2" />
          <stop offset="0.28" stopColor="#FFFFFF" />
          <stop offset="0.62" stopColor="#E4EAF3" />
          <stop offset="1" stopColor="#97A4B7" />
        </linearGradient>
        <linearGradient id="gJarN" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#09204A" />
          <stop offset="0.3" stopColor="#3560B0" />
          <stop offset="0.65" stopColor="#17366B" />
          <stop offset="1" stopColor="#06142E" />
        </linearGradient>
        <linearGradient id="gCap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0A1226" />
          <stop offset="0.35" stopColor="#4A5675" />
          <stop offset="1" stopColor="#0A1226" />
        </linearGradient>
        <linearGradient id="gBlk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A5268" />
          <stop offset="1" stopColor="#05070C" />
        </linearGradient>
        <radialGradient id="gTab" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#CBD4E1" />
        </radialGradient>
        <radialGradient id="gTan" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#F6E3C4" />
          <stop offset="1" stopColor="#B98A52" />
        </radialGradient>
        <radialGradient id="gPink" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#FBE6E8" />
          <stop offset="1" stopColor="#D49BA4" />
        </radialGradient>
        <radialGradient id="gGold" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#FFEFB8" />
          <stop offset="1" stopColor="#D08F12" />
        </radialGradient>
        <radialGradient id="gSphere" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#E4F0FC" />
          <stop offset="0.6" stopColor="#8FB9E6" />
          <stop offset="1" stopColor="#2F5BA8" />
        </radialGradient>
        <radialGradient id="gShadow">
          <stop offset="0" stopColor="#0B1630" stopOpacity="0.38" />
          <stop offset="1" stopColor="#0B1630" stopOpacity="0" />
        </radialGradient>

        <symbol id="i-box1" viewBox="0 0 96 96">
          <ellipse cx="48" cy="88" rx="38" ry="5" fill="url(#gShadow)" />
          <polygon points="12,32 30,22 82,22 64,32" fill="url(#gTop)" />
          <rect x="12" y="32" width="52" height="52" rx="1.5" fill="url(#gNavy)" />
          <polygon points="64,32 82,22 82,74 64,84" fill="url(#gNavySide)" />
          <g fill="#fff">
            <rect x="18" y="39" width="30" height="4" rx="1" opacity="0.95" />
            <rect x="18" y="48" width="40" height="2.4" opacity="0.7" />
            <rect x="18" y="54" width="36" height="2.4" opacity="0.7" />
            <rect x="18" y="60" width="40" height="2.4" opacity="0.7" />
            <rect x="18" y="66" width="32" height="2.4" opacity="0.7" />
            <rect x="18" y="72" width="38" height="2.4" opacity="0.7" />
          </g>
        </symbol>

        <symbol id="i-box2" viewBox="0 0 96 96">
          <ellipse cx="48" cy="88" rx="38" ry="5" fill="url(#gShadow)" />
          <polygon points="12,32 30,22 82,22 64,32" fill="url(#gTop)" />
          <rect x="12" y="32" width="52" height="52" rx="1.5" fill="url(#gSilver)" />
          <polygon points="22,62 34,44 41,53 46,47 54,62" fill="#0B2654" />
          <rect x="20" y="68" width="30" height="3.2" rx="1" fill="#0B2654" />
          <rect x="26" y="74" width="18" height="2" fill="#0B2654" opacity="0.6" />
          <polygon points="64,32 82,22 82,74 64,84" fill="url(#gNavySide)" />
          <path
            d="M68 44 L79 38 M68 51 L79 45 M68 58 L79 52 M68 65 L79 59"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
        </symbol>

        <symbol id="i-q" viewBox="0 0 96 96">
          <ellipse cx="48" cy="88" rx="26" ry="4.5" fill="url(#gShadow)" />
          <circle cx="48" cy="46" r="32" fill="url(#gSphere)" />
          <ellipse
            cx="38"
            cy="30"
            rx="13"
            ry="7"
            fill="#fff"
            opacity="0.5"
            transform="rotate(-25 38 30)"
          />
          <text
            x="48"
            y="60"
            textAnchor="middle"
            fontFamily="Inter,system-ui,sans-serif"
            fontSize="40"
            fontWeight="700"
            fill="#0B2654"
          >
            ?
          </text>
        </symbol>

        <symbol id="i-sd" viewBox="0 0 48 80">
          <ellipse cx="24" cy="76" rx="18" ry="3" fill="url(#gShadow)" />
          <rect x="6" y="4" width="36" height="68" rx="3" fill="url(#gSky)" />
          <rect x="6" y="4" width="36" height="8" rx="3" fill="#fff" opacity="0.35" />
          <rect x="6" y="64" width="36" height="8" rx="3" fill="#fff" opacity="0.25" />
          <path
            d="M8 8h32M8 68h32"
            stroke="#0B2654"
            strokeWidth="0.8"
            strokeDasharray="1.6 1.6"
            opacity="0.45"
          />
          <rect x="10" y="14" width="4" height="48" rx="2" fill="#fff" opacity="0.35" />
          <circle cx="25" cy="30" r="5" fill="#0B2654" />
          <path
            d="M25 20v3M25 37v3M15 30h3M32 30h3M18 23l2 2M30 35l2 2M18 37l2-2M30 25l2-2"
            stroke="#0B2654"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <rect x="14" y="46" width="22" height="3" rx="1" fill="#0B2654" opacity="0.7" />
          <rect
            x="17"
            y="52"
            width="16"
            height="2.2"
            rx="1"
            fill="#0B2654"
            opacity="0.45"
          />
        </symbol>

        <symbol id="i-sn" viewBox="0 0 48 80">
          <ellipse cx="24" cy="76" rx="18" ry="3" fill="url(#gShadow)" />
          <rect x="6" y="4" width="36" height="68" rx="3" fill="url(#gDark)" />
          <rect x="6" y="4" width="36" height="8" rx="3" fill="#fff" opacity="0.12" />
          <rect x="6" y="64" width="36" height="8" rx="3" fill="#fff" opacity="0.08" />
          <path
            d="M8 8h32M8 68h32"
            stroke="#fff"
            strokeWidth="0.8"
            strokeDasharray="1.6 1.6"
            opacity="0.35"
          />
          <rect x="10" y="14" width="4" height="48" rx="2" fill="#fff" opacity="0.12" />
          <path
            d="M29 22a8.5 8.5 0 1 0 4 13 7.5 7.5 0 0 1-4-13z"
            fill="#F4F7FC"
          />
          <rect x="14" y="46" width="22" height="3" rx="1" fill="#fff" opacity="0.7" />
          <rect
            x="17"
            y="52"
            width="16"
            height="2.2"
            rx="1"
            fill="#fff"
            opacity="0.45"
          />
        </symbol>

        <symbol id="i-tab" viewBox="0 0 40 26">
          <ellipse cx="20" cy="22" rx="17" ry="3" fill="url(#gShadow)" />
          <ellipse cx="20" cy="14" rx="17" ry="8" fill="#AEB9C9" />
          <ellipse cx="20" cy="11" rx="17" ry="8" fill="url(#gTab)" />
          <ellipse cx="14" cy="8" rx="7" ry="2.4" fill="#fff" opacity="0.75" />
        </symbol>

        <symbol id="i-tan" viewBox="0 0 40 26">
          <ellipse cx="20" cy="22" rx="17" ry="3" fill="url(#gShadow)" />
          <ellipse cx="20" cy="14" rx="17" ry="8" fill="#8C6538" />
          <ellipse cx="20" cy="11" rx="17" ry="8" fill="url(#gTan)" />
          <ellipse cx="14" cy="8" rx="7" ry="2.4" fill="#fff" opacity="0.5" />
        </symbol>

        <symbol id="i-pink" viewBox="0 0 40 26">
          <ellipse cx="20" cy="22" rx="17" ry="3" fill="url(#gShadow)" />
          <ellipse cx="20" cy="14" rx="17" ry="8" fill="#B27C86" />
          <ellipse cx="20" cy="11" rx="17" ry="8" fill="url(#gPink)" />
          <ellipse cx="14" cy="8" rx="7" ry="2.4" fill="#fff" opacity="0.6" />
        </symbol>

        <symbol id="i-cap" viewBox="0 0 46 26">
          <ellipse cx="23" cy="23" rx="19" ry="2.6" fill="url(#gShadow)" />
          <rect x="2" y="5" width="42" height="15" rx="7.5" fill="url(#gBlk)" />
          <rect x="8" y="7.5" width="28" height="3" rx="1.5" fill="#fff" opacity="0.3" />
        </symbol>

        <symbol id="i-gel" viewBox="0 0 40 26">
          <ellipse cx="20" cy="23" rx="15" ry="2.6" fill="url(#gShadow)" />
          <ellipse cx="20" cy="13" rx="17" ry="9.5" fill="url(#gGold)" />
          <ellipse cx="14" cy="8" rx="7" ry="2.6" fill="#fff" opacity="0.6" />
        </symbol>

        <symbol id="i-jar" viewBox="0 0 40 68">
          <ellipse cx="20" cy="64" rx="17" ry="3.5" fill="url(#gShadow)" />
          <rect x="4" y="20" width="32" height="44" rx="6" fill="url(#gJar)" />
          <rect x="7" y="8" width="26" height="14" rx="3" fill="url(#gCap)" />
          <path
            d="M10 12h20"
            stroke="#fff"
            strokeOpacity="0.25"
            strokeWidth="1.4"
          />
          <rect x="7" y="32" width="26" height="22" rx="2" fill="#0B2654" />
          <rect x="11" y="37" width="14" height="2.6" fill="#fff" />
          <rect
            x="11"
            y="43"
            width="18"
            height="1.8"
            fill="#fff"
            opacity="0.6"
          />
          <rect
            x="11"
            y="48"
            width="12"
            height="1.8"
            fill="#fff"
            opacity="0.6"
          />
        </symbol>

        <symbol id="i-jarn" viewBox="0 0 40 68">
          <ellipse cx="20" cy="64" rx="17" ry="3.5" fill="url(#gShadow)" />
          <rect x="4" y="20" width="32" height="44" rx="6" fill="url(#gJarN)" />
          <rect x="7" y="8" width="26" height="14" rx="3" fill="url(#gCap)" />
          <path
            d="M10 12h20"
            stroke="#fff"
            strokeOpacity="0.25"
            strokeWidth="1.4"
          />
          <rect x="7" y="32" width="26" height="22" rx="2" fill="#F4F7FC" />
          <rect x="11" y="37" width="14" height="2.6" fill="#0B2654" />
          <rect
            x="11"
            y="43"
            width="18"
            height="1.8"
            fill="#0B2654"
            opacity="0.6"
          />
          <rect
            x="11"
            y="48"
            width="12"
            height="1.8"
            fill="#0B2654"
            opacity="0.6"
          />
        </symbol>

        <symbol id="i-sachets" viewBox="0 0 96 96">
          <use
            href="#i-sd"
            x="6"
            y="12"
            width="42"
            height="70"
            transform="rotate(-6 27 47)"
          />
          <use
            href="#i-sn"
            x="48"
            y="12"
            width="42"
            height="70"
            transform="rotate(6 69 47)"
          />
        </symbol>

        <symbol id="i-jars" viewBox="0 0 96 96">
          <use href="#i-jar" x="3" y="28" width="27" height="46" />
          <use href="#i-jarn" x="33" y="14" width="30" height="51" />
          <use href="#i-jar" x="66" y="28" width="27" height="46" />
        </symbol>

        <symbol id="i-either" viewBox="0 0 96 96">
          <use href="#i-sd" x="6" y="14" width="38" height="63" />
          <use href="#i-jarn" x="50" y="22" width="38" height="64" />
        </symbol>

        <symbol id="i-custom" viewBox="0 0 96 96">
          <use href="#i-sd" x="2" y="12" width="40" height="67" />
          <use href="#i-tab" x="46" y="12" width="40" height="26" />
          <use href="#i-cap" x="44" y="38" width="46" height="26" />
          <use href="#i-gel" x="48" y="60" width="38" height="25" />
        </symbol>

        <symbol id="i-pills" viewBox="0 0 340 52">
          <use href="#i-tab" x="0" y="10" width="46" height="30" />
          <use href="#i-cap" x="52" y="12" width="56" height="32" />
          <use href="#i-gel" x="114" y="9" width="48" height="31" />
          <use href="#i-tan" x="168" y="10" width="46" height="30" />
          <use href="#i-pink" x="220" y="10" width="46" height="30" />
          <use href="#i-cap" x="272" y="12" width="56" height="32" />
        </symbol>
      </defs>
    </svg>
  );
}
