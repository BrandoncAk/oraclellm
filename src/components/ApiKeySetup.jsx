import React, { useState } from 'react';
import { getAvailableModels } from '../services/geminiService';

export default function ApiKeySetup({ onSubmit }) {
  const [apiKey, setApiKey] = useState('');
  const models = getAvailableModels();
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim(), selectedModel);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-md w-full text-center">
        {/* Decoración del orbe */}
        <div className="oracle-orb mx-auto mb-8 w-32 h-32 flex items-center justify-center">
          <span className="text-4xl">🔮</span>
        </div>

        <h1 className="font-display text-4xl text-cosmos-gold mb-3 tracking-wider">
          OracleBot
        </h1>
        <p className="font-heading text-cosmos-star/40 text-sm tracking-[0.3em] uppercase mb-8">
          El Oráculo Cósmico
        </p>

        <p className="font-body text-cosmos-star/60 text-lg mb-8 italic leading-relaxed">
          Para despertar al Oráculo, debes proporcionarle la llave del conocimiento artificial...
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="font-heading text-cosmos-star/40 text-xs tracking-widest uppercase block mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="api-key-input"
              autoFocus
            />
          </div>

          <div className="text-left">
            <label className="font-heading text-cosmos-star/40 text-xs tracking-widest uppercase block mb-2">
              Modelo
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="api-key-input appearance-none cursor-pointer"
            >
              {models.map((m) => (
                <option key={m} value={m} className="bg-cosmos-void text-cosmos-star">
                  {m}
                </option>
              ))}
            </select>
            <p className="font-body text-cosmos-star/30 text-xs mt-1 italic">
              Si un modelo da error 429, prueba con otro. Cada modelo tiene cuota independiente.
            </p>
          </div>

          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-cosmos-purple/50 to-cosmos-blue/50 
                       border border-cosmos-gold/30 rounded-xl font-heading text-cosmos-gold 
                       tracking-widest uppercase text-sm hover:border-cosmos-gold/60 
                       hover:shadow-lg hover:shadow-cosmos-gold/10 transition-all duration-300
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ✦ Despertar al Oráculo ✦
          </button>
        </form>

        <div className="mt-8 p-4 border border-cosmos-star/10 rounded-xl">
          <p className="font-body text-cosmos-star/40 text-sm leading-relaxed">
            Obtén tu key gratuita en{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cosmos-gold/70 underline hover:text-cosmos-gold transition-colors"
            >
              Google AI Studio
            </a>
            . Tu clave se usa solo en tu navegador y no se almacena en ningún servidor.
          </p>
        </div>
      </div>
    </div>
  );
}
