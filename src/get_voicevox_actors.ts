import fs from "fs";
import axios from "axios";

/* 
    事前準備
    /Applications/VOICEVOX.app/Contents/Resources/vv-engine/run --enable_cancellable_synthesis
    でVOICEVOXを起動しておく

    実行方法
    npx tsx src/get_voicevox_actors.ts
*/

const VOICEVOX_API_URL = "http://host.docker.internal:50021"; // docker内からホストマシン(Mac)のlocalhostにアクセスするためのアドレス


async function getSpeakers() {
    try {
        const response = await axios.get(`${VOICEVOX_API_URL}/speakers`);
        const speakers = response.data;

        console.log("Raw API Response:", speakers); // APIのレスポンスを確認

        const voiceActors = speakers.map((speaker: any) => ({
            id: speaker.speaker_uuid,
            name: speaker.name,
            nameReading: speaker.nameKana || "", // 読み仮名がある場合
            age: speaker.age || null, // 年齢データがあれば
            gender: speaker.gender?.toUpperCase() || "UNKNOWN", // 性別データがある場合
            birthMonth: speaker.birthMonth || null,
            birthDay: speaker.birthDay || null,
            smallImageUrl: speaker.imageUrls?.small || "",
            mediumImageUrl: speaker.imageUrls?.medium || "",
            largeImageUrl: speaker.imageUrls?.large || "",
            sampleVoiceUrl: speaker.sampleVoiceUrl || "",
            sampleScript: speaker.sampleScript || "",
            recommendedVoiceSpeed: speaker.recommendedVoiceSpeed || 1.0,
            voiceStyles: speaker.styles.map((style: any) => ({
                id: style.id,
                style: style.name
            }))
        }));

        const result = { voiceActors };
        // console.log("Formatted Data:", JSON.stringify(result, null, 2));

        // JSONデータをファイルに書き出す
        const filePath = "voicevox_actors.json";
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
        console.log(`JSONデータを ${filePath} に保存しました！`);

        

        return result;
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}

const main = async () => {

    // 話者一覧を取得して、JSONファイルに保存
    getSpeakers();

};

main();
