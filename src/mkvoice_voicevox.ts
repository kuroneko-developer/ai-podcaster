import fs from "fs";
import axios from "axios";
import { text } from "stream/consumers";

/* 
    事前準備
    /Applications/VOICEVOX.app/Contents/Resources/vv-engine/run --enable_cancellable_synthesis
    でVOICEVOXを起動しておく

    実行方法
    npx tsx src/mkvoice_voicevox.ts
*/

const VOICEVOX_API_URL = "http://host.docker.internal:50021"; // docker内からホストマシン(Mac)のlocalhostにアクセスするためのアドレス


async function createSpeech(voice_text: string, SPEAKER_ID: number, OUTPUT_FILE: string) {
    try {
        // 1. 音声合成用のクエリを取得
        const queryResponse = await axios.post(
            `${VOICEVOX_API_URL}/audio_query`,
            null,
            { params: {text: voice_text, speaker: SPEAKER_ID } }
        );

        // console.log(queryResponse.data);
        queryResponse.data.speedScale = 1.25; // 発話速度を1.25倍に変更

        // 2. 音声データを生成
        const synthesisResponse = await axios.post(
            //`${VOICEVOX_API_URL}/synthesis`,
            `${VOICEVOX_API_URL}/cancellable_synthesis`,
            queryResponse.data,
            { 
                params: { speaker: SPEAKER_ID },
                responseType: "arraybuffer" // 音声データをバイナリで受け取る
            }
        );

        // 3. 音声データをファイルに保存
        fs.writeFileSync(OUTPUT_FILE, Buffer.from(synthesisResponse.data));
        console.log(`音声データを ${OUTPUT_FILE} に保存しました。`);
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
}

const main = async () => {

    // 実行例
    const SPEAKER_ID = 3; // 話者のID（VOICEVOXのキャラクターによって異なる）
    const OUTPUT_FILE = "voicevox_output.wav"; // 保存する音声データのファイル名
    const voice_text = "こんにちは、VOICEVOX APIのテストです。"; // 音声合成するテキスト
    createSpeech(voice_text, SPEAKER_ID, OUTPUT_FILE);
};

main();
