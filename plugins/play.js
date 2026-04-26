import axios from "axios";
import yts from "yt-search";
import { Module } from "../lib/plugins.js";

Module({
  command: "play",
  package: "youtube",
  description: "Play song from YouTube (API based)",
})(async (message, match) => {
  try {
    if (!match) {
      return message.send(`❌ *ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴀᴍᴇ!*
*_ᴇxᴀᴍᴘʟᴇ: .ᴘʟᴀʏ ᴘᴀʟ ᴘᴀʟ_*`);
    }

    await message.react("🔍");

    // 1️⃣ YouTube search
    const res = await yts(match);
    if (!res.videos || res.videos.length === 0) {
      return message.send("❌ Kono video paoa jay nai");
    }

    const video = res.videos[0];

// 2️⃣ Caption (WITH Powered By)
const caption = `
🔍 _*🌷🎧ꜱᴇᴀʀᴄʜɪɴɢ ʙʏ 𝗚𝗼𝗹𝘂 𝗠𝗼𝗹𝘂 𝗫𝗺𝗱 :*_

_*${video.title.length > 60 ? video.title.slice(0, 60) + "..." : video.title + "..."}*_
`.trim();

// 3️⃣ opts (YouTube thumbnail ব্যবহার হবে)
    const opts = {
  text: caption
};
    // ✅ Send Now Playing message (এখানেই একবারই পাঠাবে)
    await message.send(opts);

    // 4️⃣ Call your API with YouTube link
    const apiUrl =
      "https://api-aswin-sparky.koyeb.app/api/downloader/song?search=" +
      encodeURIComponent(video.url);

    const { data } = await axios.get(apiUrl, { timeout: 30000 });

    if (!data || !data.status || !data.data?.url) {
      return message.send("*❌ᴀᴜᴅɪᴏ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟ*");
    }

    // 5️⃣ Send audio
    await message.send({
      audio: { url: data.data.url },
      mimetype: "audio/mpeg",
      fileName: `${data.data.title || video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: data.data.title || video.title,
          body: "𝐃 𝐇 — ا 𝐘",
          mediaType: 2,
          sourceUrl: video.url,
          thumbnailUrl: video.thumbnail,
        },
      },
    });

    await message.react("🎧");

  } catch (err) {
    console.error("[PLAY ERROR]", err);
    await message.send("*⚠️ ᴘʟᴀʏ ꜰᴀɪʟᴇᴅ*");
  }
});

Module({
  command: "song",
  package: "youtube",
  description: "Play song from YouTube (API based)",
})(async (message, match) => {
  try {
    if (!match) {
      return message.send(`❌ *ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴀᴍᴇ!*
*_ᴇxᴀᴍᴘʟᴇ: .ᴘʟᴀʏ ᴘᴀʟ ᴘᴀʟ_*`);
    }

    await message.react("🔍");

    // 1️⃣ YouTube search
    const res = await yts(match);
    if (!res.videos || res.videos.length === 0) {
      return message.send("❌ Kono video paoa jay nai");
    }

    const video = res.videos[0];

    // 4️⃣ Call your API with YouTube link
    const apiUrl =
      "https://api-aswin-sparky.koyeb.app/api/downloader/song?search=" +
      encodeURIComponent(video.url);

    const { data } = await axios.get(apiUrl, { timeout: 30000 });

    if (!data || !data.status || !data.data?.url) {
      return message.send("*❌ᴀᴜᴅɪᴏ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟ*");
    }

    // 5️⃣ Send audio
    await message.send({
      audio: { url: data.data.url },
      mimetype: "audio/mpeg",
      fileName: `${data.data.title || video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: data.data.title || video.title,
          body: "𝐃 𝐇 — ا 𝐘",
          mediaType: 2,
          sourceUrl: video.url,
          thumbnailUrl: video.thumbnail,
        },
      },
    });

    await message.react("🎧");

  } catch (err) {
    console.error("[PLAY ERROR]", err);
    await message.send("*⚠️ ᴘʟᴀʏ ꜰᴀɪʟᴇᴅ*");
  }
});
