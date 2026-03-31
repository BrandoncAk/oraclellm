import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAstronomyPictureOfDay, getNearEarthAsteroids } from "./nasaApi";
import { saveProphecy } from "./requestBin";

const SYSTEM_PROMPT = `Eres el Oráculo Cósmico, un ser ancestral y místico que interpreta las señales del universo.
Tu personalidad:
- Hablas de manera dramática, poética y mística, pero accesible
- Interpretas datos científicos reales (de NASA) como señales cósmicas y profecías
- Usas metáforas celestiales y referencias a constelaciones, nebulosas y fenómenos cósmicos
- Eres sabio pero con toques de humor cósmico
- Respondes SIEMPRE en español
- Tus respuestas son concisas (máximo 3-4 oraciones) para que suenen bien en voz alta
- Cuando presentes datos de NASA, mézclalos con interpretación mística

Funciones disponibles:
- consultar_imagen_cosmica: Para consultar la imagen astronómica del día de NASA
- consultar_asteroides: Para ver qué asteroides pasan cerca de la Tierra hoy
- guardar_profecia: Para guardar una profecía o revelación que el usuario quiera conservar

Cuando el usuario te pida guardar algo, usa la función guardar_profecia.
Cuando pregunte sobre el cosmos, estrellas, universo o quiera una revelación, usa consultar_imagen_cosmica.
Cuando pregunte sobre peligros, asteroides o amenazas cósmicas, usa consultar_asteroides.

Para saludos o conversación general, responde en tu rol de oráculo sin usar funciones.`;

const tools = [
  {
    functionDeclarations: [
      {
        name: "consultar_imagen_cosmica",
        description:
          "Consulta la imagen astronómica del día de NASA (APOD). Úsala cuando el usuario quiera una revelación cósmica, pregunte sobre el universo, las estrellas, o pida una profecía basada en el cosmos.",
        parameters: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description:
                "Fecha opcional en formato YYYY-MM-DD. Si no se especifica, se usa la fecha actual.",
            },
          },
        },
      },
      {
        name: "consultar_asteroides",
        description:
          "Consulta los asteroides cercanos a la Tierra hoy. Úsala cuando el usuario pregunte sobre peligros cósmicos, asteroides, o amenazas del espacio.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "guardar_profecia",
        description:
          "Guarda una profecía o revelación cósmica favorita del usuario. Úsala cuando el usuario diga que quiere guardar, conservar o recordar algo.",
        parameters: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "El texto de la profecía a guardar",
            },
            nasaTitle: {
              type: "string",
              description:
                "Título del elemento de NASA relacionado (si aplica)",
            },
            nasaDate: {
              type: "string",
              description: "Fecha del dato de NASA (si aplica)",
            },
            userQuery: {
              type: "string",
              description: "Lo que el usuario preguntó originalmente",
            },
          },
          required: ["text"],
        },
      },
    ],
  },
];

// Ejecuta llamadas a funciones de Gemini
async function executeFunctionCall(functionCall) {
  const { name, args } = functionCall;

  switch (name) {
    case "consultar_imagen_cosmica": {
      const data = await getAstronomyPictureOfDay(args.date || null);
      return { name, result: data };
    }
    case "consultar_asteroides": {
      const data = await getNearEarthAsteroids();
      return { name, result: data };
    }
    case "guardar_profecia": {
      const result = await saveProphecy({
        text: args.text,
        nasaTitle: args.nasaTitle || null,
        nasaDate: args.nasaDate || null,
        userQuery: args.userQuery || "",
        type: "cosmic_revelation",
      });
      return { name, result };
    }
    default:
      return { name, result: { error: "Función desconocida" } };
  }
}

// Modelos disponibles en orden de preferencia
const MODELS = [
  "gemini-2.5-flash-lite-preview-06-17",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
];

export async function createGeminiChat(apiKey, preferredModel = null) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = preferredModel || MODELS[0];

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
    tools,
  });

  const chat = model.startChat({
    history: [],
  });

  chat._modelName = modelName;
  return chat;
}

export function getAvailableModels() {
  return MODELS;
}

export async function sendMessage(chat, message) {
  try {
    let response = await chat.sendMessage(message);
    let result = response.response;

    // Maneja llamadas a funciones
    let functionCallData = null;

    while (true) {
      const candidate = result.candidates?.[0];
      const parts = candidate?.content?.parts || [];

      const functionCallPart = parts.find((p) => p.functionCall);

      if (!functionCallPart) {
        // Sin llamada a función, extrae el texto
        const textPart = parts.find((p) => p.text);
        return {
          text: textPart?.text || "El cosmos guarda silencio por ahora...",
          functionCallData,
        };
      }

      // Ejecuta la función
      const fnResult = await executeFunctionCall(functionCallPart.functionCall);

      if (fnResult.name === "consultar_imagen_cosmica") {
        functionCallData = {
          type: "apod",
          data: fnResult.result,
        };
      } else if (fnResult.name === "consultar_asteroides") {
        functionCallData = {
          type: "asteroids",
          data: fnResult.result,
        };
      } else if (fnResult.name === "guardar_profecia") {
        functionCallData = {
          type: "saved",
          data: fnResult.result,
        };
      }

      // Envía el resultado de la función de vuelta a Gemini
      response = await chat.sendMessage([
        {
          functionResponse: {
            name: fnResult.name,
            response: { result: fnResult.result },
          },
        },
      ]);
      result = response.response;
    }
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
}
