import { Configuration, OpenAIApi } from "openai";
import config from "config";
import { createReadStream } from "fs";

const configuration = new Configuration({
  apiKey: config.get("OPENAI_KEY"),
});

const openai = new OpenAIApi(configuration);
const roles = {
  ASSISTANT: "assistant",
  USER: "user",
  SYSTEN: "system",
};

const transcription = async (filepath) => {
  try {
    const file = await createReadStream(filepath);
    const response = await openai.createTranscription(file, "whisper-1");

    return await response.data.text;
  } catch (error) {
    console.log("Error while transcription ", error.message);
  }
};

const chat = async (messages) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    const result = response.data.choices[0].message;

    console.log(result);

    return result;
  } catch (error) {
    console.log("Error with create chat: ", error.message);
  }
};

export { chat, roles, transcription };
