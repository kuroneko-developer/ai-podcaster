import axios from "axios";
import fs from "fs";

// const VOICEVOX_API_URL = "http://localhost:50021"; // VoicevoxエンジンのURL
const VOICEVOX_API_URL = "http://host.docker.internal:50021"; // docker内からホスト側のlocalhostにアクセスする場合

const OUTPUT_FILE = "voicevox_actors.json";


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
    const speakers = await getSpeakers();
    const allSpeakerInfo = {
        voiceActors: []
    };

    console.log(speakers);

    for (const speaker of speakers) {
        const info = await getSpeakerInfo(speaker.speaker_uuid);
        allSpeakerInfo.voiceActors.push({
            name: speaker.name,
            speaker_uuid: speaker.speaker_uuid,
            styles: speaker.styles,
            version: speaker.version,
            supported_features: speaker.supported_features,
            policy: info.policy
        });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allSpeakerInfo, null, 2));
    // console.log(JSON.stringify(allSpeakerInfo, null, 2));
}

fetchAllSpeakerInfo();
