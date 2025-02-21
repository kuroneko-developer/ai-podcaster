# ai-podcaster

## Initialization

```
yarn install
```
create .env file with your OpenAI key
```
OPENAI_API_KEY={your OpenAI key}
```

## Step.1: Create a podcast episode

1. Have the “Cloud” read the base articles, papers, etc. Ask questions and brush up on information as needed.
   "Cloud"にベースになる記事や論文などを読ませる。必要に応じて質問して、情報をブラッシュアップする。
2. Enter a sample JSON podcast script in “Cloud” and have the script file written (use the contents of “. /prompt.md").
   "Cloud"にJSONポッドキャスト・スクリプトのサンプルを入力して、スクリプトファイルを書いてもらう（「./prompt.md」の内容を使う）。

>   プロンプト例:
>   下記の設定に従って、高校生でもわかるように説明して
>    テーマ: Chat GPT
>    タイトル: 1分で分かる "{テーマ}"
>    出力形式：script_format.json
>    言語: textは日本語

3. Create a json file with that generated JSON (such as ./scripts/elon.json)
   生成されたJSONでjsonファイルを作成する（./scripts/elon.jsonなど）。
4. Run ```yarn run gen {path to the script file}```.
   yarn run gen {path to the script file} を実行する。   
5. The output will be generated in the ./output folder.
   出力は./outputフォルダに生成される。

```json
"script": [
  {
    "speaker": "Teacher",
    "text": "そうだね。今日は、特に二つの画期的な技術について詳しく説明するよ。「DeepSeek-R1-Zero」と「DeepSeek-R1」というんだ。この技術が特に注目されているのは、AIの学習方法を大きく変えて、開発コストを大幅に下げることができたからなんだ。",
  }
]
```

## Step.2: Create a text2image script.

1. Claudeを使って、セリフごとに text2image 向けのプロンプトを作成
   「text2image向けのプロンプトを作れ」
   Youtubeライブ向けの縦動画であれば、その指示を追加（手作業）

```json
{
      "speaker": "Teacher",
      "text": "そうだね。今日は、特に二つの画期的な技術について詳しく説明するよ。「DeepSeek-R1-Zero」と「DeepSeek-R1」というんだ。この技術が特に注目されているのは、AIの学習方法を大きく変えて、開発コストを大幅に下げることができたからなんだ。",
      "imagePrompt": "Split screen showing two distinct AI systems, one labeled R1-Zero and one R1, with floating mathematical symbols and cost graphs trending downward, professional infographic style",
    },
```

## Step.3: Split a script and assign image numbers.

1. Run ```yarn run split {path to the script file}```
   yarn run split {path to the script file} を実行する。
2. A script is created with “imageIndex” and “images” added.
   *note: that the source script file will be overwritten and changed.*
   "imageIndex"と"images"を加えたスクリプトが作成される
   *注意: ソースのスクリプトファイルが上書き変更されるので注意*

```json
"script": [
  {
    "speaker": "Teacher",
    "text": "そうだね。今日は、特に二つの画期的な技術について詳しく説明するよ。「DeepSeek-R1-Zero」と「DeepSeek-R1」というんだ。この技術が特に注目されているのは、AIの学習方法を大きく変えて、開発コストを大幅に下げることができたからなんだ。",
    "imagePrompt": "Split screen showing two distinct AI systems, one labeled R1-Zero and one R1, with floating mathematical symbols and cost graphs trending downward, professional infographic style",
    "imageIndex": 0
  }
],
"images": [
  {
    "index": 0
  }
]
```

## Step.4: Create speech and BGM files

1. Run ```yarn run gen {path to the script file}```
  ```yarn run gen {path to the script file}``` を実行する。
2. scratchpadフォルダに音声ファイルが出力される。
      {script_file_name}0.mp3
      {script_file_name}1.mp3
      ...
      {script_file_name}n.mp3
3. OutputフォルダにspeechファイルとBGMファイルが出力される。
      {script_file_name}.mp3
      {script_file_name}_bgm.mp3

## Step.5: Create image files

1. Run ```yarn run images {path to the script file}```
  ```yarn run images {path to the script file}``` を実行する。
2. scratchpadフォルダに画像ファイルが出力される。
      {script_file_name}_0.png
      {script_file_name}_1.png
      ...
      {script_file_name}_n.png

```json
"script": [
  {
    "speaker": "Teacher",
    "text": "そうだね。今日は、特に二つの画期的な技術について詳しく説明するよ。「DeepSeek-R1-Zero」と「DeepSeek-R1」というんだ。この技術が特に注目されているのは、AIの学習方法を大きく変えて、開発コストを大幅に下げることができたからなんだ。",
    "imagePrompt": "Split screen showing two distinct AI systems, one labeled R1-Zero and one R1, with floating mathematical symbols and cost graphs trending downward, professional infographic style",
    "imageIndex": 0
  }
],
"images": [
  {
    "index": 0,
    "image": "./images/{script_file_name}}/0p.png"
  }
]
```

## Step.6: Create a movie file

1. Run ```yarn run mov {path to the script file}```
  ```yarn run mov {path to the script file}``` を実行する。
2. The output will be generated in the ./output folder.
   出力は./outputフォルダに生成される。
      {script_file_name}.mp4

# Script format

```Javascript
{
  "title": "title of the podcast",
  "description": "The description of the podcast.",
  "reference": "URL to the source data", // optional
  "tts": "openAI", // or "nijivoice", default is "openAI"
  "voices": ["nova", "onyx"], // TTS-specific voice identifiers (host and others), optional.
  "script": [
    {
      "speaker": "Host",
      "text": "words from the host."
    },
    {
      "speaker": "Guest",
      "text": "words from the guest."
    },
    ...
  ]
}
```
