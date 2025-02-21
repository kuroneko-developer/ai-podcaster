import { AgentFunction, AgentFunctionInfo } from "graphai";

// Voicevoxのデフォルト設定
// const DEFAULT_VOICEVOX_URL = "http://localhost:50021";
const DEFAULT_VOICEVOX_URL = "http://host.docker.internal:50021";
const DEFAULT_SPEAKER_ID = 3; // デフォルト話者ID
const DEFAULT_SPEED = 1.25;     // デフォルト話速

export const ttsVoicevoxAgent: AgentFunction = async ({
  params,
  namedInputs,
}) => {
  const { 
    apiUrl = DEFAULT_VOICEVOX_URL,
    voice = DEFAULT_SPEAKER_ID,
    speed = DEFAULT_SPEED,
    throwError = true
  } = params;

  const { text } = namedInputs;

  try {
    // クエリパラメータ生成
    const queryParams = new URLSearchParams({
      text: text,
      speaker: voice,
    });

    // 音声クエリ生成リクエスト
    const queryResponse = await fetch(`${apiUrl}/audio_query?${queryParams}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!queryResponse.ok) throw new Error("Query generation failed");

    const queryData = await queryResponse.json();
    
    // 音声合成パラメータ設定
    const synthesisParams = {
      ...queryData,
      speedScale: speed,
    };

    // 音声合成リクエスト
    const synthesisResponse = await fetch(
      `${apiUrl}/synthesis?speaker=${voice}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(synthesisParams),
      }
    );

    if (!synthesisResponse.ok) throw new Error("Synthesis failed");

    // 音声データ取得
    const arrayBuffer = await synthesisResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return { buffer };

  } catch (e) {
    if (throwError) {
      console.error("Voicevox Error:", e);
      throw new Error("Voicevox TTS Error");
    }
    return {
      error: e instanceof Error ? e.message : "Unknown Voicevox error",
    };
  }
};

const ttsVoicevoxAgentInfo: AgentFunctionInfo = {
  name: "ttsVoicevoxAgent",
  agent: ttsVoicevoxAgent,
  mock: ttsVoicevoxAgent,
  samples: [],
  description: "Voicevox TTS Agent (Local Server)",
  category: ["tts"],
  author: "daiki hamada",
  repository: "",
  license: "MIT",
//   parameters: {
//     apiUrl: {
//       type: "string",
//       description: "Voicevox API endpoint URL",
//       default: DEFAULT_VOICEVOX_URL,
//     },
//     speaker: {
//       type: "number",
//       description: "Speaker ID",
//       default: DEFAULT_SPEAKER_ID,
//     },
//     speed: {
//       type: "number",
//       description: "Speech speed (0.5-2.0)",
//       default: DEFAULT_SPEED,
//     },
//   },
};

export default ttsVoicevoxAgentInfo;