import React from 'react';
import { motion } from 'framer-motion';
import { useLoop, EASE } from './useLoop';

/*
 * Quartzite, simulating.
 *
 * The circuit is the one every intro lab starts with: Y = (A · B) + C, three
 * slide switches into an AND and an OR, out to a red LED on the DE10. Each
 * beat flips the switches to the next test vector, the signal walks the wires
 * stage by stage, and the waveform underneath records it — which is the
 * editor, the simulator and the .vwf in one picture.
 *
 * Sits on the dark feature panel, so it is styled for that ground only.
 */
const VECTORS = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 1],
  [0, 1, 0],
  [1, 1, 1],
];
const BEATS = VECTORS.map(() => 1500);

const out = ([a, b, c]) => ((a && b) || c ? 1 : 0);
const and = ([a, b]) => (a && b ? 1 : 0);

const HIGH = '#60a5fa'; // blue-400
const LOW = '#334155'; // slate-700

/* A wire is drawn twice: the dark copper underneath, and the signal on top,
   which draws itself left to right when the net goes high. `stage` delays it
   so the AND settles before the OR, the way the simulator steps it. */
function Wire({ d, on, stage = 0 }) {
  return (
    <>
      <path d={d} stroke={LOW} strokeWidth="1.5" fill="none" />
      <motion.path
        d={d}
        stroke={HIGH}
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: on ? 1 : 0 }}
        transition={{ duration: 0.35, delay: on ? stage * 0.22 : 0, ease: EASE }}
      />
    </>
  );
}

function Trace({ values, y, label, x0, w }) {
  const d = values
    .map((v, i) => {
      const yy = y + (v ? 0 : 9);
      return `${i === 0 ? 'M' : 'L'} ${x0 + i * w} ${yy} L ${x0 + (i + 1) * w} ${yy}`;
    })
    .join(' ');
  return (
    <g>
      <text x="4" y={y + 8} fontSize="7.5" fontFamily="ui-monospace, monospace" fill="#64748b">
        {label}
      </text>
      <path d={d} stroke={label === 'Y' ? '#f43f5e' : HIGH} strokeWidth="1.25" fill="none" />
    </g>
  );
}

export default function Schematic() {
  const { ref, beat } = useLoop(BEATS);
  const [a, b, c] = VECTORS[beat];
  const ab = and(VECTORS[beat]);
  const y = out(VECTORS[beat]);

  const x0 = 22;
  const w = (300 - x0 - 6) / VECTORS.length;

  return (
    <figure ref={ref} className="m-0 w-full max-w-[340px]">
      {/* Tab strip, as in the app: the .bdf is what you are looking at. */}
      <div className="mb-2 flex items-center gap-3 font-mono text-[9px] text-slate-500">
        <span className="text-slate-200">lab3.bdf</span>
        <span>Waveform.vwf</span>
        <span>Pin Planner</span>
      </div>

      <svg
        viewBox="0 0 300 116"
        className="w-full"
        role="img"
        aria-label="A schematic of Y equals A and B, or C, wired from three switches to an LED, simulating each input combination in turn."
      >
        {/* Dotted canvas, like any schematic editor */}
        <defs>
          <pattern id="qz-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="#1e293b" />
          </pattern>
          <radialGradient id="qz-led">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="300" height="116" fill="url(#qz-grid)" />

        {/* Inputs */}
        {[
          ['SW0', 'A', 20, a],
          ['SW1', 'B', 52, b],
          ['SW2', 'C', 96, c],
        ].map(([pin, name, yy, v]) => (
          <g key={pin} fontFamily="ui-monospace, monospace">
            <text x="2" y={yy + 3} fontSize="7.5" fill="#64748b">
              {pin}
            </text>
            <rect x="22" y={yy - 5} width="18" height="10" rx="2" fill="none" stroke="#475569" />
            <motion.rect
              y={yy - 3.5}
              width="7"
              height="7"
              rx="1.5"
              initial={false}
              animate={{ x: v ? 31.5 : 23.5, fill: v ? HIGH : '#64748b' }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            />
            <text x="46" y={yy - 3} fontSize="7" fill="#94a3b8">
              {name}
            </text>
          </g>
        ))}

        <Wire d="M 40 20 H 112 V 30 H 130" on={a} />
        <Wire d="M 40 52 H 130" on={b} />
        <Wire d="M 168 41 H 186 V 52 H 204" on={ab} stage={1} />
        <Wire d="M 40 96 H 186 V 70 H 204" on={c} />
        <Wire d="M 242 61 H 266" on={y} stage={2} />

        {/* AND */}
        <path
          d="M 130 21 H 148 A 20 20 0 0 1 148 61 H 130 Z"
          fill="#0f172a"
          stroke="#94a3b8"
          strokeWidth="1.25"
        />
        <text x="139" y="44" fontSize="7" fontFamily="ui-monospace, monospace" fill="#64748b">
          AND
        </text>

        {/* OR */}
        <path
          d="M 198 41 Q 216 41 230 50 Q 238 55 242 61 Q 238 67 230 72 Q 216 81 198 81 Q 210 61 198 41 Z"
          fill="#0f172a"
          stroke="#94a3b8"
          strokeWidth="1.25"
        />
        <text x="212" y="64" fontSize="7" fontFamily="ui-monospace, monospace" fill="#64748b">
          OR
        </text>

        {/* LEDR0. Red because the DE10's are. */}
        <motion.circle
          cx="276"
          cy="61"
          r="16"
          fill="url(#qz-led)"
          initial={false}
          animate={{ scale: y ? 1 : 0.2 }}
          style={{ transformOrigin: '276px 61px' }}
          transition={{ duration: 0.4, delay: y ? 0.5 : 0, ease: EASE }}
        />
        <motion.circle
          cx="276"
          cy="61"
          r="6"
          stroke="#f43f5e"
          strokeWidth="1.25"
          initial={false}
          animate={{ fill: y ? '#f43f5e' : '#1e293b' }}
          transition={{ duration: 0.25, delay: y ? 0.5 : 0 }}
        />
        <text x="266" y="86" fontSize="7" fontFamily="ui-monospace, monospace" fill="#64748b">
          LEDR0
        </text>
      </svg>

      {/* The waveform the simulator writes, recorded up to the playhead. */}
      <div className="mt-3 rounded border border-slate-800 bg-slate-950/60 px-1 py-1.5">
        <svg viewBox="0 0 300 62" className="w-full" aria-hidden="true">
          <defs>
            <clipPath id="qz-rec">
              <motion.rect
                x="0"
                y="0"
                height="62"
                initial={false}
                animate={{ width: x0 + (beat + 1) * w }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </clipPath>
          </defs>
          {[1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1={x0 + i * w}
              x2={x0 + i * w}
              y1="0"
              y2="62"
              stroke="#1e293b"
              strokeDasharray="2 3"
            />
          ))}
          <g clipPath="url(#qz-rec)">
            <Trace values={VECTORS.map((v) => v[0])} y={2} label="A" x0={x0} w={w} />
            <Trace values={VECTORS.map((v) => v[1])} y={17} label="B" x0={x0} w={w} />
            <Trace values={VECTORS.map((v) => v[2])} y={32} label="C" x0={x0} w={w} />
            <Trace values={VECTORS.map(out)} y={47} label="Y" x0={x0} w={w} />
          </g>
          <motion.line
            y1="0"
            y2="62"
            stroke="#e2e8f0"
            strokeWidth="1"
            initial={false}
            animate={{ x1: x0 + (beat + 1) * w, x2: x0 + (beat + 1) * w }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </svg>
      </div>
    </figure>
  );
}
