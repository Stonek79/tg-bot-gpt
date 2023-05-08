import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { unlink } from "fs/promises";
import { error } from "console";

const _dirname = dirname(fileURLToPath(import.meta.url));
ffmpeg.setFfmpegPath(installer.path);

const create = async (url, filename) => {
  try {
    const oggPath = resolve(_dirname, "../voices", `${filename}.ogg`);

    const response = await axios.get(url, { responseType: "stream" });

    return new Promise((res) => {
      const stream = createWriteStream(oggPath);
      response.data.pipe(stream);
      stream.on("finish", () => res(oggPath));
    });
  } catch (error) {
    console.log("Create ogg file error ", error.message);
  }
};

const toMp3 = async (input, output) => {
  try {
    const outputPath = resolve(dirname(input), `${output}.mp3`);

    return new Promise((res, rej) => {
      ffmpeg(input)
        .inputOption("-t 30")
        .output(outputPath)
        .on("end", () => {
          res(outputPath);
          unlink(input);
        })
        .on("error", (err) => rej(error.message))
        .run();
    });
  } catch (error) {
    console.log("Error while create mp3 ", error.message);
  }
};

export { create, toMp3 };
