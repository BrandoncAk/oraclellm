# 🔮 OracleBot — El Oráculo Cósmico

Un Voicebot interactivo que actúa como un oráculo místico, interpretando datos astronómicos reales de la NASA como profecías cósmicas. Construido con React, Gemini AI con Function Calling, y Web Speech API.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?logo=google)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)

---

## 🌌 ¿Qué es OracleBot?

OracleBot es un asistente de voz que combina ciencia real con narrativa mística. Al consultar al Oráculo:

- **Hablas con tu voz** y el Oráculo responde hablando
- Consulta la **Imagen Astronómica del Día (APOD)** de la NASA y la interpreta como una señal cósmica
- Revela los **asteroides cercanos a la Tierra** hoy como advertencias del cosmos
- Permite **guardar tus profecías favoritas** en un registro cósmico (Pipedream RequestBin)

## ✨ Características

| Feature | Implementación |
|---|---|
| 🎤 Entrada de voz en vivo | Web Speech API (SpeechRecognition) |
| 🗣️ Respuesta por voz | Web Speech API (SpeechSynthesis) |
| 🤖 LLM Multimodal | Gemini 2.0 Flash con Function Calling |
| 🌠 Consulta HTTP #1 | NASA APOD API (imagen astronómica del día) |
| ☄️ Consulta HTTP #1b | NASA NeoWs API (asteroides cercanos) |
| 📜 Registro HTTP #2 | Pipedream RequestBin (POST de profecías) |
| ⌨️ Input de texto | Fallback para navegadores sin soporte de voz |
| 📱 Responsive | Diseño adaptable mobile/desktop |

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite 6
- **Estilos:** Tailwind CSS 3
- **LLM:** Google Gemini 2.0 Flash (con Function Calling)
- **Voz:** Web Speech API (nativa del navegador)
- **APIs externas:**
  - [NASA APOD API](https://api.nasa.gov/) — Imagen astronómica del día
  - [NASA NeoWs API](https://api.nasa.gov/) — Asteroides cercanos
  - [Pipedream RequestBin](https://pipedream.com/) — Registro de profecías
- **Deploy:** Vercel

## 🚀 Instrucciones para correr localmente

### Prerrequisitos

- Node.js 18+ instalado
- Una API Key de Gemini (gratuita)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/oraclebot.git
cd oraclebot
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Haz clic en "Create API Key"
3. Copia la key generada

> **Nota:** No necesitas archivo `.env`. La key se ingresa directamente en la UI del navegador y solo se usa del lado del cliente.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en **Google Chrome** (recomendado para soporte completo de voz).

### 5. Build de producción

```bash
npm run build
npm run preview
```

## 🌐 Deploy en Vercel

```bash
# Con Vercel CLI
npm i -g vercel
vercel

# O simplemente conecta tu repositorio de GitHub en vercel.com
```

## 📖 Cómo usar

1. **Ingresa tu API Key** de Gemini en la pantalla inicial
2. **Toca el orbe cósmico** 🔮 para activar el reconocimiento de voz
3. **Habla tu consulta**, por ejemplo:
   - *"¿Qué revelan las estrellas hoy?"* → Consulta la imagen del día de NASA
   - *"¿Hay asteroides cerca de la Tierra?"* → Muestra asteroides cercanos
   - *"Guarda esta profecía"* → Registra tu profecía favorita
   - *"Dame una profecía cósmica"* → El Oráculo interpreta el cosmos
4. El Oráculo **responde con voz** en su estilo místico
5. También puedes **escribir** en el campo de texto si tu navegador no soporta voz

## 🏗️ Arquitectura

```
src/
├── components/
│   ├── ApiKeySetup.jsx    # Pantalla de configuración inicial
│   ├── ChatMessages.jsx   # Historial de conversación + datos NASA
│   ├── OracleOrb.jsx      # Orbe interactivo con estados visuales
│   ├── Starfield.jsx      # Fondo animado de estrellas
│   └── TextInput.jsx      # Input de texto alternativo
├── hooks/
│   └── useSpeech.js       # Hook para Web Speech API (STT + TTS)
├── services/
│   ├── geminiService.js   # Integración Gemini + Function Calling
│   ├── nasaApi.js         # Servicio NASA (APOD + NeoWs)
│   └── requestBin.js      # Servicio RequestBin (guardar profecías)
├── App.jsx                # Componente principal
├── index.css              # Estilos globales + animaciones
└── main.jsx               # Entry point
```

### Function Calling Flow

```
Usuario habla → SpeechRecognition → Texto → Gemini AI
                                                 ↓
                                         ¿Necesita datos?
                                           ↙        ↘
                                         Sí          No
                                         ↓            ↓
                                  Ejecuta función   Responde
                                  (NASA / RequestBin)  directo
                                         ↓
                                  Envía resultado
                                  de vuelta a Gemini
                                         ↓
                                  Gemini interpreta
                                  místicamente
                                         ↓
                                  SpeechSynthesis ← Texto
```

## ⚠️ Notas importantes

- **Navegador recomendado:** Google Chrome (mejor soporte de Web Speech API)
- **La API Key de Gemini** se procesa 100% en el navegador del cliente. No se envía a ningún servidor propio.
- **NASA DEMO_KEY** tiene límite de 30 requests/hora. Para uso intensivo, obtén tu propia key gratuita en [api.nasa.gov](https://api.nasa.gov/).
- El endpoint de **RequestBin** es para demostración. En producción, reemplázalo con tu propio endpoint de Pipedream.

## 📝 Personalización

### Cambiar el endpoint de RequestBin

Edita `src/services/requestBin.js` y reemplaza la URL:

```js
const REQUESTBIN_URL = 'https://tu-endpoint.m.pipedream.net';
```

### Crear tu propio RequestBin

1. Ve a [pipedream.com](https://pipedream.com)
2. Crea un nuevo workflow con trigger "HTTP / Webhook"
3. Copia la URL del endpoint
4. Pégala en `requestBin.js`

---

Hecho con ✨ por Brandon — *Las estrellas guían a quienes las consultan.*
