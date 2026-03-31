import React, { useEffect, useRef } from 'react';

function NasaImage({ data }) {
  if (!data || data.media_type === 'video') return null;

  return (
    <div className="nasa-image mt-3 max-w-md">
      <img
        src={data.url}
        alt={data.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-3 bg-cosmos-void/80">
        <p className="font-heading text-cosmos-gold text-sm">{data.title}</p>
        <p className="font-body text-cosmos-star/50 text-xs mt-1">
          📅 {data.date} • 📷 {data.copyright}
        </p>
      </div>
    </div>
  );
}

function AsteroidData({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="font-heading text-cosmos-gold text-xs tracking-widest uppercase">
        ☄️ Asteroides cercanos hoy
      </p>
      {data.map((a, i) => (
        <div
          key={i}
          className="text-xs font-mono text-cosmos-star/60 flex items-center gap-2"
        >
          <span className={a.is_potentially_hazardous ? 'text-red-400' : 'text-cosmos-gold/60'}>
            {a.is_potentially_hazardous ? '⚠️' : '🪨'}
          </span>
          <span>{a.name}</span>
          <span className="text-cosmos-star/30">•</span>
          <span>{a.diameter_meters}m</span>
          <span className="text-cosmos-star/30">•</span>
          <span>{(a.miss_distance_km / 1000000).toFixed(1)}M km</span>
        </div>
      ))}
    </div>
  );
}

function SavedBadge() {
  return (
    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-cosmos-gold/10 border border-cosmos-gold/30 rounded-full">
      <span className="text-sm">📜</span>
      <span className="font-heading text-cosmos-gold text-xs tracking-wider">
        PROFECÍA GUARDADA
      </span>
    </div>
  );
}

export default function ChatMessages({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-4 px-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl ${
            msg.role === 'oracle' ? 'message-oracle' : 'message-user'
          }`}
          style={{
            animation: `toastIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">
              {msg.role === 'oracle' ? '🔮' : '🗣️'}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className={`font-body text-base leading-relaxed ${
                  msg.role === 'oracle'
                    ? 'text-cosmos-star/90 italic'
                    : 'text-cosmos-star/70'
                }`}
              >
                {msg.text}
              </p>

              {msg.functionData?.type === 'apod' && (
                <NasaImage data={msg.functionData.data} />
              )}
              {msg.functionData?.type === 'asteroids' && (
                <AsteroidData data={msg.functionData.data} />
              )}
              {msg.functionData?.type === 'saved' && <SavedBadge />}
            </div>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
