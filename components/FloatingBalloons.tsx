'use client'

interface BalloonProps {
  color: string
  size: number
}

function Balloon({ color, size }: BalloonProps) {
  const h = size * 1.5
  return (
    <svg width={size} height={h} viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Corpo do balão */}
      <ellipse cx="30" cy="28" rx="27" ry="26" fill={color} />
      {/* Reflexo */}
      <ellipse cx="19" cy="16" rx="9" ry="7" fill="white" fillOpacity="0.35" />
      {/* Nozinho */}
      <path d="M27 53 Q30 57 33 53" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="54" r="2.5" fill={color} />
      {/* Barbante */}
      <path
        d="M30 57 Q35 63 27 69 Q34 75 28 82"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
    </svg>
  )
}

const BALLOONS = [
  { color: '#FF6B9D', left: '4%',  delay: '0s',   duration: '11s', size: 56 },
  { color: '#4DAEE5', left: '8%',  delay: '3s',   duration: '14s', size: 44 },
  { color: '#FFD93D', left: '88%', delay: '1s',   duration: '12s', size: 60 },
  { color: '#C084FC', left: '93%', delay: '4.5s', duration: '10s', size: 48 },
  { color: '#4ADE80', left: '2%',  delay: '6s',   duration: '13s', size: 52 },
  { color: '#FF9A4A', left: '96%', delay: '2s',   duration: '15s', size: 42 },
  { color: '#4DAEE5', left: '91%', delay: '8s',   duration: '11s', size: 36 },
  { color: '#FF6B9D', left: '6%',  delay: '9s',   duration: '13s', size: 40 },
]

export function FloatingBalloons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: b.left,
            animation: `float-up ${b.duration} linear ${b.delay} infinite`,
          }}
        >
          <Balloon color={b.color} size={b.size} />
        </div>
      ))}
    </div>
  )
}
