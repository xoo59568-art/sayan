import { Module } from "../lib/plugins.js";
import fetch from "node-fetch";

Module({
  command: "gemini",
  package: "ai",
  description: "Chat with gemini",
})(async (message, match) => {
  if (!match) return message.send("_Please provide a question_");

  try {
    const sent = await message.send("🤔 Thinking...");
    const res = await fetch(
      `https://api.privatezia.biz.id/api/ai/luminai?query=${encodeURIComponent(
        match
      )}`
    );
    const data = await res.json();

    if (!data.status) {
      return await message.send(
        "*ʀᴇꜱᴘᴏɴꜱᴇ ꜰᴀɪʟᴇᴅ ᴛʀʏ `ᴀɢᴀɪɴ`*",
        { edit: sent.key }
      );
    }

    const answer = data.data;
    await message.send(answer, { edit: sent.key });
  } catch (error) {
    console.error("[gemini ERROR]:", error.message);
    await message.send("*ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴛʀʏ ᴀɢᴀɪɴ `ʟᴀᴛᴇʀ`*");
  }
});

Module({
  command: "gpt",
  package: "ai",
  description: "Chat with GPT AI",
})(async (message, match) => {
  if (!match) return message.send("_Please provide a question_");
  try {
    const sent = await message.send("🤔 Thinking...");
    const res = await fetch(
      `https://api.privatezia.biz.id/api/ai/luminai?query=${encodeURIComponent(
        match
      )}`
    );
    const data = await res.json();

    if (!data.status) {
      return await message.send(
        "*ʀᴇꜱᴘᴏɴꜱᴇ ꜰᴀɪʟᴇᴅ ᴛʀʏ `ᴀɢᴀɪɴ`*",
        { edit: sent.key }
      );
    }

    const answer = data.response;
    await message.send(answer, { edit: sent.key });
  } catch (error) {
    console.error("[gpt ERROR]:", error.message);
    await message.send("*ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴛʀʏ ᴀɢᴀɪɴ `ʟᴀᴛᴇʀ`*");
  }
});

