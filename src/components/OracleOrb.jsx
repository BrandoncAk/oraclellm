import React from 'react';

export default function OracleOrb({ state, onClick, disabled }) {
  const stateClass =
    state === 'listening'
      ? 'listening'
      : state === 'speaking'
      ? 'speaking'
      : state === 'thinking'
      ? 'thinking'
      : '';

  const stateLabel = {
    idle: 'Toca para consultar al Oráculo',
    listening: 'El Oráculo escucha...',
    thinking: 'Consultando las estrellas...',
    speaking: 'El Oráculo habla...',
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={onClick}
        disabled={disabled || state === 'thinking'}
        className={`oracle-orb ${stateClass} ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        }`}
        aria-label={stateLabel[state]}
      >
        {/* Efectos de brillo interior */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {state === 'listening' && (
            <div className="absolute inset-4 rounded-full border border-cosmos-gold/30 animate-ping" />
          )}
          {state === 'thinking' && (
            <>
              <div
                className="absolute w-3 h-3 bg-cosmos-gold/60 rounded-full animate-orbit"
                style={{ top: '50%', left: '50%' }}
              />
              <div
                className="absolute w-2 h-2 bg-cosmos-purple/60 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  animation: 'orbit 10s linear infinite reverse',
                }}
              />
            </>
          )}
        </div>

        {/* Ícono central */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl">
          {state === 'listening' ? '👁️' : state === 'thinking' ? '✨' : '🔮'}
        </div>
      </button>

      {/* Onda de sonido al escuchar */}
      {state === 'listening' && (
        <div className="sound-wave">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="sound-bar"
              style={{
                '--bar-height': `${Math.random() * 25 + 10}px`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: `${0.3 + Math.random() * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      <p className="font-heading text-cosmos-star/60 text-sm tracking-widest uppercase">
        {stateLabel[state]}
      </p>
    </div>
  );
}
