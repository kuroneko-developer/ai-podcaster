import axios from "axios";

// const VOICEVOX_API_URL = "http://localhost:50021"; // VoicevoxエンジンのURL
const VOICEVOX_API_URL = "http://host.docker.internal:50021"; // docker内からホスト側のlocalhostにアクセスする場合

async function addUserDictionary(entry) {
  const { surface, pronunciation, accent_type, word_type, priority } = entry;

  try {
    const response = await axios.post(
      `${VOICEVOX_API_URL}/user_dict_word?surface=${entry.surface}&pronunciation=${entry.pronunciation}&accent_type=${entry.accent_type}&word_type=${entry.word_type}&priority=${entry.priority}`,
      null, // リクエストボディは空
    );

    console.log("User dictionary updated successfully!", response.data);
  } catch (error) {
    console.error("Error updating user dictionary:", error.response?.data || error.message);
  }
}

async main() {

const entry = {
  surface: "ChatGPT",
  pronunciation: "チャットジーピーティー",
  accent_type: 5,
  word_type: "PROPER_NOUN",
  priority: 1
};
  addUserDictionary(entry);

}

main();
