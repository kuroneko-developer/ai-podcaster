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
2. Enter a sample JSON podcast script in “Cloud” and have the script file written (use the contents of “./prompts/prompt.md").
   "Cloud"にJSONポッドキャスト・スクリプトのサンプルを入力して、スクリプトファイルを書いてもらう（ “./prompts/prompt.md" の内容を使う）。

<br>
<details><summary><b>プロンプト例</b></summary><div>

```
この件について、内容全てを高校生にも分かるように、太郎くん(Student)と先生(Teacher)の会話、という形の台本をArtifactとして作って。ただし要点はしっかりと押さえて。
以下に別のトピックに関するサンプルを貼り付けます。このJSONフォーマットに従って。

{
  "title": "韓国の戒厳令とその日本への影響",
  "description": "韓国で最近発令された戒厳令とその可能性のある影響について、また日本の憲法に関する考慮事項との類似点を含めた洞察に満ちた議論。",
  "tts": "nijivoice",
  "voices": [
    "afd7df65-0fdc-4d31-ae8b-a29f0f5eed62",
    "a7619e48-bf6a-4f9f-843f-40485651257f",
    "bc06c63f-fef6-43b6-92f7-67f919bd5dae"
  ],
  "charactors": ["春玲", "森野颯太", "ベン・カーター"],
  "speakers": ["Announcer", "Student", "Teacher"],
  "script": [
    {
      "speaker": "Student",
      "text": "先生、今日は韓国で起きた戒厳令のことを教えてもらえますか？"
    },
    {
      "speaker": "Teacher",
      "text": "もちろんだよ、太郎くん。韓国で最近、大統領が「戒厳令」っていうのを突然宣言したんだ。"
    },
    {
      "speaker": "Student",
      "text": "戒厳令ってなんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "簡単に言うと、国がすごく危ない状態にあるとき、軍隊を使って人々の自由を制限するためのものなんだ。たとえば、政治活動を禁止したり、人の集まりを取り締まったりするんだよ。"
    },
    {
      "speaker": "Student",
      "text": "それって怖いですね。なんでそんなことをしたんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "大統領は「国会がうまく機能していないから」と言っていたけど、実際には自分の立場を守るために使ったように見えるんだ。それで、軍隊が国会に突入して、議員たちを捕まえようとしたんだ。"
    },
    {
      "speaker": "Student",
      "text": "ええっ！？国会議員を捕まえようとするなんて、すごく危ないことじゃないですか。"
    },
    {
      "speaker": "Teacher",
      "text": "その通りだよ。もし軍隊が国会を占拠していたら、国会で戒厳令を解除することもできなかったかもしれない。つまり、大統領がずっと自分の好きなように国を支配できるようになってしまうんだ。"
    },
    {
      "speaker": "Student",
      "text": "韓国ではどうなったんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "幸い、野党の議員や市民たちが急いで集まって抗議して、6時間後に戒厳令は解除されたんだ。でも、ほんの少しの違いで、韓国の民主主義が大きく傷つけられるところだったんだよ。"
    },
    {
      "speaker": "Student",
      "text": "それは大変なことですね…。日本ではそんなこと起きないんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "実はね、今、日本でも似たような話があるんだよ。自民党が「緊急事態宣言」を憲法に追加しようとしているんだ。"
    },
    {
      "speaker": "Student",
      "text": "緊急事態宣言って、韓国の戒厳令と同じようなものなんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "似ている部分があるね。たとえば、総理大臣が「社会秩序の混乱の危険があるから」と言えば、特別な権限を使って国を動かすことができるんだ。法律と同じ力を持つ命令を出したり、地方自治体に指示を出したりすることができるんだよ。"
    },
    {
      "speaker": "Student",
      "text": "それって便利そうですけど、なんだか心配です。"
    },
    {
      "speaker": "Teacher",
      "text": "そうだね。もちろん、緊急時には素早い対応が必要だから便利な面もあるけど、その権限が濫用されると、とても危険なんだ。たとえば、総理大臣が自分に都合のいいように国を動かしたり、国民の自由を奪ったりすることができるようになってしまうかもしれない。"
    },
    {
      "speaker": "Student",
      "text": "韓国みたいに、軍隊が政治に口を出してくることもあり得るんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "完全にあり得ないとは言えないからこそ、注意が必要なんだ。私たち国民は、自民党の改憲案が権力の濫用を防ぐための適切な制限を含んでいるのかをしっかり監視し、声を上げることが求められる。民主主義が損なわれるのを防ぐために、私たち一人ひとりが積極的に関心を持つことが大切なんだよ。"
    },
    {
      "speaker": "Student",
      "text": "ありがとうございます。とても良い勉強になりました。"
    },
    {
      "speaker": "Announcer",
      "text": "ご視聴、ありがとうございました。次回の放送もお楽しみに。"
    }
  ]
}
```
</div></details>
<br>

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
   “./prompts/image_prompt.md"
   Youtubeライブ向けの縦動画であれば、その指示を追加（手作業）

<br>
<details><summary><b>プロンプト例</b></summary><div>

```
このポッドキャストのために、一連の画像を生成する必要があります。与えられたjsonの各行に対して、全体の議論の流れを考慮して、テキスト-2-画像AIのための適切なテキストプロンプトを生成し、スクリプトに「imagePrompt」プロパティとして追加します。画像に生徒、教師、教室を表示しない。セリフは消さないでください。

[Examples]
A modern tech conference stage with a speaker discussing AI advancements, futuristic lighting and a large digital screen displaying AI-related graphics.
A close-up of an AI executive speaking at a press conference, with a backdrop displaying AI chip designs and a world map.
A futuristic AI research lab with glowing blue data streams and a large AI model being visualized on a digital display.
A high-tech meeting room with analysts discussing global AI trends, holographic charts displaying AI development.
A balanced scale with AI progress on one side and economic factors on the other, symbolizing analysis and perspective.
A newspaper headline about a breakthrough in AI technology, with digital code overlaying the article.
A timeline showing the gradual evolution of AI models, with key milestones highlighted.
```
</div></details>
<br>

```json
"script": [
  {
    "speaker": "Teacher",
    "text": "そうだね。今日は、特に二つの画期的な技術について詳しく説明するよ。「DeepSeek-R1-Zero」と「DeepSeek-R1」というんだ。この技術が特に注目されているのは、AIの学習方法を大きく変えて、開発コストを大幅に下げることができたからなんだ。",
    "imagePrompt": "Split screen showing two distinct AI systems, one labeled R1-Zero and one R1, with floating mathematical symbols and cost graphs trending downward, professional infographic style",
  }
]
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
