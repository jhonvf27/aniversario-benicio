'use client'

/**
 * Carrinho correndo pelo rodapé da página em loop
 */
export function RacingCar() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full pointer-events-none overflow-hidden z-10"
      style={{ height: '48px' }}
      aria-hidden="true"
    >
      {/* Pista — linha tracejada */}
      <div
        className="absolute bottom-3 left-0 w-full"
        style={{
          height: '2px',
          background: 'repeating-linear-gradient(90deg, #FFD700 0, #FFD700 20px, transparent 20px, transparent 40px)',
          animation: 'race-road 0.5s linear infinite',
          opacity: 0.4,
        }}
      />

      {/* Carrinho */}
      <div
        className="absolute bottom-4"
        style={{ animation: 'race-car 9s linear infinite' }}
      >
        <span style={{ fontSize: '2rem', display: 'block', transform: 'scaleX(1)' }}>🏎️</span>
      </div>

      {/* Segundo carrinho — defasado */}
      <div
        className="absolute bottom-4"
        style={{ animation: 'race-car 9s linear 4.5s infinite' }}
      >
        <span style={{ fontSize: '1.5rem', display: 'block', opacity: 0.6 }}>🚗</span>
      </div>
    </div>
  )
}
