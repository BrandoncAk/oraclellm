import React, { useState, useRef, useCallback, useEffect } from "react";
import Starfield from "./components/Starfield";
import OracleOrb from "./components/OracleOrb";
import ChatMessages from "./components/ChatMessages";
import ApiKeySetup from "./components/ApiKeySetup";
import TextInput from "./components/TextInput";
import { useSpeech } from "./hooks/useSpeech";
import { createGeminiChat, sendMessage } from "./services/geminiService";

export default function App() {
  const [apiKey, setApiKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [orbState, setOrbState] = useState("idle"); // idle | listening | thinking | speaking
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const chatRef = useRef(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setTranscript,
  } = useSpeech();

  //  Inicializa Chat Gemini cuando la API KEY es establecida
  const handleApiKeySubmit = useCallback(async (key, model) => {
    try {
      const chat = await createGeminiChat(key, model);
      chatRef.current = chat;
      setApiKey(key);
      setError(null);
    } catch (err) {
      setError("Error al inicializar Gemini. Verifica tu API key.");
      console.error(err);
    }
  }, []);

  // Procesa un mensaje del usuario (por voz o texto)
  const processMessage = useCallback(
    async (text) => {
      if (!chatRef.current || !text.trim()) return;

      // Agrega el mensaje del usuario
      setMessages((prev) => [...prev, { role: "user", text }]);
      setOrbState("thinking");

      try {
        const response = await sendMessage(chatRef.current, text);

        // Agrega la respuesta del oráculo
        setMessages((prev) => [
          ...prev,
          {
            role: "oracle",
            text: response.text,
            functionData: response.functionCallData || null,
          },
        ]);

        // Muestra toast para profecías guardadas
        if (response.functionCallData?.type === "saved") {
          showToast("📜 Profecía inscrita en los registros cósmicos");
        }

        // Pronuncia la respuesta
        setOrbState("speaking");
        await speak(response.text);
        setOrbState("idle");
      } catch (err) {
        console.error("Error processing message:", err);
        setOrbState("idle");
        let errorMsg;
        if (
          err.message?.includes("429") ||
          err.message?.includes("RESOURCE_EXHAUSTED") ||
          err.message?.includes("quota")
        ) {
          errorMsg =
            "Has agotado la cuota de este modelo. Recarga la página y selecciona otro modelo (cada uno tiene cuota independiente).";
        } else if (
          err.message?.includes("API key") ||
          err.message?.includes("401") ||
          err.message?.includes("403")
        ) {
          errorMsg =
            "API key inválida. Recarga la página e intenta con otra key.";
        } else if (
          err.message?.includes("not found") ||
          err.message?.includes("404")
        ) {
          errorMsg =
            "Este modelo no está disponible. Recarga la página y selecciona otro modelo.";
        } else {
          errorMsg =
            "Las estrellas se han nublado momentáneamente. Intenta de nuevo.";
        }
        setMessages((prev) => [...prev, { role: "oracle", text: errorMsg }]);
      }
    },
    [speak],
  );

  // Maneja cambios en el transcripto (entrada de voz completada)
  useEffect(() => {
    if (transcript) {
      processMessage(transcript);
      setTranscript("");
    }
  }, [transcript, processMessage, setTranscript]);

  // Sincroniza el estado del orbe con el estado de voz
  useEffect(() => {
    if (isListening) setOrbState("listening");
  }, [isListening]);

  // Maneja el clic en el orbe
  const handleOrbClick = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      setOrbState("idle");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  }, [isListening, isSpeaking, startListening, stopListening, stopSpeaking]);

  // Auxiliar de notificaciones toast
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Muestra la configuración de API key si no está configurada
  if (!apiKey) {
    return (
      <div className="min-h-screen relative">
        <Starfield />
        <ApiKeySetup onSubmit={handleApiKeySubmit} />
        {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-900/80 border border-red-500/50 rounded-xl text-red-200 font-body text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-32">
      <Starfield />

      {/* Encabezado */}
      <header className="relative z-10 text-center pt-8 pb-4 px-4">
        <h1 className="font-display text-3xl md:text-5xl text-cosmos-gold tracking-wider">
          OracleBot
        </h1>
        <p className="font-heading text-cosmos-star/30 text-xs tracking-[0.4em] uppercase mt-2">
          Intérprete de las señales del cosmos
        </p>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center px-4">
        {/* Mensaje de bienvenida si no hay mensajes aún */}
        {messages.length === 0 && (
          <div className="text-center mb-8 max-w-lg">
            <p className="font-body text-cosmos-star/50 text-lg italic leading-relaxed">
              "Pregúntame sobre el cosmos y revelaré las señales ocultas en las
              estrellas. Puedo mostrarte la imagen cósmica del día, alertarte
              sobre asteroides cercanos, o guardar las profecías que resuenen
              contigo."
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                "¿Qué revelan las estrellas hoy?",
                "¿Hay asteroides cerca?",
                "Dame una profecía",
              ].map((hint) => (
                <button
                  key={hint}
                  onClick={() => processMessage(hint)}
                  className="px-3 py-1.5 border border-cosmos-star/15 rounded-full 
                             font-body text-cosmos-star/40 text-sm hover:border-cosmos-gold/40 
                             hover:text-cosmos-gold/60 transition-all duration-300"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Orbe del Oráculo */}
        <OracleOrb
          state={orbState}
          onClick={handleOrbClick}
          disabled={!isSupported && orbState === "idle"}
        />

        {/* Advertencia de compatibilidad del navegador */}
        {!isSupported && (
          <p className="font-body text-amber-400/60 text-sm mt-4 text-center">
            ⚠️ Tu navegador no soporta reconocimiento de voz. Usa el campo de
            texto o prueba en Chrome.
          </p>
        )}

        {/* Campo de texto alternativo */}
        <div className="mt-6 w-full max-w-xl">
          <TextInput
            onSend={processMessage}
            disabled={orbState === "thinking" || orbState === "speaking"}
          />
        </div>

        {/* Mensajes del chat */}
        <ChatMessages messages={messages} />
      </main>

      {/* Notificación toast */}
      {toast && (
        <div className="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-cosmos-nebula/90 border border-cosmos-gold/40 rounded-xl backdrop-blur-lg">
          <p className="font-heading text-cosmos-gold text-sm tracking-wider">
            {toast}
          </p>
        </div>
      )}

      {/* Pie de página */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 py-3 bg-gradient-to-t from-cosmos-void via-cosmos-void/80 to-transparent">
        <p className="font-body text-cosmos-star/20 text-xs text-center tracking-wider">
          Datos astronómicos proporcionados por NASA • Gemini AI • OracleBot
          v1.0
        </p>
      </footer>
    </div>
  );
}
