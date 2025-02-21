import fetch from 'node-fetch';
import axios from "axios";
import qs from "qs"; // クエリパラメータをエンコードするために使用

// Voicevox APIの基本設定
const VOICEVOX_API_URL = "http://host.docker.internal:50021";
const DEFAULT_ACCENT = 1; // アクセント位置（1音節目）

// axiosのインスタンスを生成
const instance = axios.create({
    baseURL: VOICEVOX_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 2000,
});


interface DictionaryEntry {
    surface: string;       // 表記
    pronunciation: string; // 読み（カタカナ）
    accent_type: number;   // アクセント型（音が下がる場所を指す）
    priority: number;      // 優先度（1-10）
}


// ユーザー辞書追加関数
async function addUserDictionary(entries: DictionaryEntry[]) {
  try {
    for (const entry of entries) {
        const response = await instance.post(`/user_dict_word?surface=${encodeURIComponent(entry.surface)}&pronunciation=${encodeURIComponent(entry.pronunciation)}&accent_type=${entry.accent_type}&word_type=${'PROPER_NOUN'}&priority=${entry.priority}`,
            null, // リクエストボディは空
        );
    //   console.log(`Successfully added: ${entry.surface} (ID: ${result.word_uuid})`);
    }
    
    // console.log('User dictionary updated successfully!');
    
  } catch (error) {
    console.error('Error updating user dictionary:', error);
    process.exit(1);
  }
}

async function getUserDictionary() {
    try {
        const response = await instance.get('/user_dict');
        return response.data;
    } catch (error) {
        console.error("Error fetching user_dict:", error);
        return [];
    }
}

const main = async () => {

    // サンプル辞書データ
    const customDictionary: DictionaryEntry[] = [
        {
            surface: "ChatGPT",
            pronunciation: "チャットジーピーティー",
            accent_type: 5,
            priority: 1
        },
        {
            surface: "AIアシスタント",
            pronunciation: "エーアイアシスタント",
            accent_type: 6,
            priority: 5
        }
    ];

    

    // 実行例
    // addUserDictionary(customDictionary)
    // .then(() => console.log('Dictionary update process completed'))
    // .catch(console.error);

    getUserDictionary()
    .then((data) => console.log(data))
    .catch(console.error);

    // addUserDictionary2("ChatGPT", "チャットジーピーティー", 5);
}

main();