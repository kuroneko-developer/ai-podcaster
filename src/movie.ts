import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { createCanvas, loadImage } from "canvas";
import { ScriptData, PodcastScript, ImageInfo } from "./type";
import { getAvailableFonts } from "font-scanner";


async function renderJapaneseTextToPNG(
  text: string,
  outputFilePath: string,
  canvasInfo: any,
  fontName: string,
) {
  const fontSize = 48;
  const paddingX = 48 * 2;
  const paddingY = 12;
  const lineHeight = fontSize + 8;

  const lines: string[] = [];
  let currentLine = "";
  let currentWidth = 0;

  // Iterate over each character and determine line breaks based on character width estimate
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    const isAnsi = code < 255;
    const isCapital = code >= 0x40 && code < 0x60;
    const charWidth = isAnsi
      ? isCapital
        ? fontSize * 0.8
        : fontSize * 0.5
      : fontSize;
    const isTrailing =
      char === "。" || char === "、" || char === "？" || char === "！";

    if (char === "\n") {
      lines.push(currentLine);
      currentLine = "";
      currentWidth = 0;
    } else if (
      currentWidth + charWidth > canvasInfo.width - paddingX * 2 &&
      !isTrailing
    ) {
      lines.push(currentLine);
      currentLine = char;
      currentWidth = charWidth;
    } else {
      currentLine += char;
      currentWidth += charWidth;
    }
  }

  // Push the last line if there's any remaining text
  if (currentLine) {
    lines.push(currentLine);
  }

  const textHeight = lines.length * lineHeight + paddingY * 2;
  const textTop = canvasInfo.height - textHeight;

  // Create a canvas and a drawing context
  const canvas = createCanvas(canvasInfo.width, canvasInfo.height);
  const context = canvas.getContext("2d");

  // Set background color
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(0, textTop, canvasInfo.width, textHeight);

  // Set text styles
  // context.font = `bold ${fontSize}px Arial`;
  context.font = `bold ${fontSize}px ${fontName}`;
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "top";

  // Set shadow properties
  context.shadowColor = "rgba(0, 0, 0, 0.8)";
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;
  context.shadowBlur = 10;

  lines.forEach((line: string, index: number) => {
    context.fillText(
      line,
      canvasInfo.width / 2,
      textTop + lineHeight * index + paddingY,
    );
  });

  // Save the image
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputFilePath, buffer);

  console.log(`Image saved to ${outputFilePath}`);
}

interface CaptionInfo {
  pathCaption: string;
  imageIndex: number;
  duration: number; // Duration in seconds for each image
}

const createVideo = (
  audioPath: string,
  captions: CaptionInfo[],
  images: ImageInfo[],
  outputVideoPath: string,
  canvasInfo: any,
) => {
  const start = performance.now();
  let command = ffmpeg();

  // Add each image input
  if (!images) {
    throw new Error("images is not defined");
  }
  images.forEach((element) => {
    command = command.input(element.image!); // HACK
  });
  captions.forEach((element) => {
    command = command.input(element.pathCaption);
  });
  const imageCount = images.length;
  const captionCount = captions.length;

  // Build filter_complex string to manage start times
  const filterComplexParts: string[] = [];

  captions.forEach((element, index) => {
    // Add filter for each image
    filterComplexParts.push(
      // Resize background image to match canvas dimensions
      `[${element.imageIndex}:v]scale=${canvasInfo.width}:${canvasInfo.height},setsar=1,trim=duration=${element.duration}[bg${index}];` +
        `[${imageCount + index}:v]scale=${canvasInfo.width * 2}:${canvasInfo.height * 2},setsar=1,format=rgba,zoompan=z=zoom+0.0004:x=iw/2-(iw/zoom/2):y=ih-(ih/zoom):s=${canvasInfo.width}x${canvasInfo.height}:fps=30:d=${element.duration * 30},trim=duration=${element.duration}[cap${index}];` +
        `[bg${index}][cap${index}]overlay=(W-w)/2:(H-h)/2:format=auto[v${index}]`,
    );
  });

  // Concatenate the trimmed images
  const concatInput = captions.map((_, index) => `[v${index}]`).join("");
  filterComplexParts.push(
    `${concatInput}concat=n=${captions.length}:v=1:a=0[v]`,
  );

  // Apply the filter complex for concatenation and map audio input
  command
    .complexFilter(filterComplexParts)
    .input(audioPath) // Add audio input
    .outputOptions([
      "-preset veryfast", // Faster encoding
      "-map [v]", // Map the video stream
      `-map ${imageCount + captionCount}:a`, // Map the audio stream (audio is the next input after all images)
      // "-c:v h264_videotoolbox", // Set video codec
      "-c:v libx264", // Set video codec
      "-threads 8",
      "-filter_threads 8",
      "-b:v 5M", // bitrate (only for videotoolbox)
      "-bufsize",
      "10M", // Add buffer size for better quality
      "-maxrate",
      "7M", // Maximum bitrate
      "-r 30", // Set frame rate
      "-pix_fmt yuv420p", // Set pixel format for better compatibility
    ])
    .on("start", (__cmdLine) => {
      console.log("Started FFmpeg ..."); // with command:', cmdLine);
    })
    .on("error", (err, stdout, stderr) => {
      console.error("Error occurred:", err);
      console.error("FFmpeg stdout:", stdout);
      console.error("FFmpeg stderr:", stderr);
    })
    .on("end", () => {
      const end = performance.now();
      console.log(`Video created successfully! ${end - start}ms`);
    })
    .output(outputVideoPath)
    .run();
};

const main = async () => {
  const arg2 = process.argv[2];
  const arg3 = process.argv[3] || "Keifont";
  const scriptPath = path.resolve(arg2);
  const parsedPath = path.parse(scriptPath);
  const name = parsedPath.name;
  const data = fs.readFileSync(scriptPath, "utf-8");
  const jsonData: PodcastScript = JSON.parse(data);

  const canvasInfo = {
    width: 1280, // not 1920
    height: 720, // not 1080
  };
  if (jsonData.aspectRatio === "9:16") {
    canvasInfo.width = 720;
    canvasInfo.height = 1280;
  }

  // font check and set
  let fontName = "Arial";
  await getAvailableFonts().then((fonts) => {
    const fontExists = fonts.some((font) => font.family === arg3);
    console.log(fonts);
    if (fontExists) {
      fontName = arg3;
      console.log(`フォント "${arg3}" を使用します。`);
    } else {
      console.log(`フォント "${arg3}" が見つかりません。"Arial"を使用します`);
    }
  });

  await renderJapaneseTextToPNG(
    `${jsonData.title}\n\n${jsonData.description}`,
    `./scratchpad/${name}_00.png`, // Output file path
    canvasInfo,
    fontName,
  ).catch((err) => {
    console.error("Error generating PNG:", err);
  });

  const promises = jsonData.script.map((element: ScriptData, index: number) => {
    return renderJapaneseTextToPNG(
      element.caption ?? element.text,
      `./scratchpad/${name}_${index}.png`, // Output file path
      canvasInfo,
      fontName,
    ).catch((err) => {
      console.error("Error generating PNG:", err);
    });
  });
  await Promise.all(promises);

  const tmScriptPath = path.resolve("./output/" + name + ".json");
  const dataTm = fs.readFileSync(tmScriptPath, "utf-8");
  const jsonDataTm: PodcastScript = JSON.parse(dataTm);

  // add images
  /*
  const imageInfo = jsonDataTm.imageInfo;
  await imageInfo.forEach(async (element: { index: number; image: string }) => {
    const { index, image } = element;
    if (image) {
      const imagePath = `./scratchpad/${name}_${index}.png`;
      const imageText = await loadImage(imagePath);
      const imageBG = await loadImage(image);
      const bgWidth = imageBG.width;
      const bgHeight = imageBG.height;
      const viewWidth = (bgWidth / bgHeight) * canvasInfo.height;
      const canvas = createCanvas(canvasInfo.width, canvasInfo.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        imageBG,
        (canvasInfo.width - viewWidth) / 2,
        0,
        viewWidth,
        canvasInfo.height,
      );
      ctx.drawImage(imageText, 0, 0);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imagePath, buffer);
    }
  });
  */

  const audioPath = path.resolve("./output/" + name + "_bgm.mp3");
  const captions: CaptionInfo[] = jsonDataTm.script.map(
    (item: any, index: number) => {
      return {
        pathCaption: path.resolve(`./scratchpad/${name}_${index}.png`),
        imageIndex: item.imageIndex,
        duration: item.duration,
      };
    },
  );
  const outputVideoPath = path.resolve("./output/" + name + "_ja.mp4");
  const titleInfo: CaptionInfo = {
    pathCaption: path.resolve(`./scratchpad/${name}_00.png`), // HACK
    imageIndex: 0, // HACK
    duration: (jsonData.padding ?? 4000) / 1000,
  };
  const captionsWithTitle = [titleInfo].concat(captions);
  // const captionsWithTitle = [captions[0], captions[1], captions[5], captions[8]];

  // console.log(audioPath);
  // console.log(captionsWithTitle);
  // console.log(jsonDataTm.images);
  // console.log(outputVideoPath);
  // console.log(canvasInfo);
  createVideo(
    audioPath,
    captionsWithTitle,
    jsonDataTm.images,
    outputVideoPath,
    canvasInfo,
  );
};

main();
