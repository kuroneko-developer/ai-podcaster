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
        return response.data;
    } catch (error) {
        console.error("Error fetching speakers:", error);
        return [];
    }
}

async function getSpeakerInfo(speakerUuid: string) {
    try {
        const response = await axios.get(`${VOICEVOX_API_URL}/speaker_info`, {
            params: { speaker_uuid: speakerUuid }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching info for speaker ${speakerUuid}:`, error);
        return null;
    }
}

async function fetchAllSpeakerInfo() {
    const speakers: any[] = await getSpeakers();
    interface VoiceStyle {
        id: number;
        style: string;
    }
    interface VoiceActor {
        id: string;
        name: string;
        nameReading: string;
        policy: string;
        recommendedVoiceSpeed: number;
        voiceStyles: VoiceStyle[];
    }
    
    const allSpeakerInfo: { voiceActors: VoiceActor[] } = {
        voiceActors: []
    };
    for (const speaker of speakers) {
        const info = await getSpeakerInfo(speaker.speaker_uuid);
        if (info) {
            allSpeakerInfo.voiceActors.push({
                id: speaker.speaker_uuid,
                name: speaker.name,
                nameReading: info.name || "",
                policy: info.policy || "",
                recommendedVoiceSpeed: speaker.recommended_speed || 1,
                voiceStyles: speaker.styles.map(style => ({
                    id: style.id,
                    style: style.name
                }))
            });
        }
    }
    // console.log(JSON.stringify(allSpeakerInfo, null, 2));
    return allSpeakerInfo;
}


const main = async () => {

    // 話者一覧を取得して、JSONファイルに保存
    const result = await fetchAllSpeakerInfo();

    // JSONデータをファイルに書き出す
    const filePath = "voicevox_actors.json";
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`JSONデータを ${filePath} に保存しました！`);
};

main();
