import React, { useState } from 'react';

export default function TextInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto flex gap-3 px-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu consulta al Oráculo..."
        disabled={disabled}
        className="api-key-input flex-1"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="px-5 py-2.5 bg-cosmos-purple/30 border border-cosmos-gold/30 rounded-xl
                   font-heading text-cosmos-gold text-sm tracking-wider uppercase
                   hover:border-cosmos-gold/60 transition-all duration-300
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ✦ Enviar
      </button>
    </form>
  );
}
