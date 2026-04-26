
import os from "os";
import { Module } from "../lib/plugins.js";
import config from "../config.js";
Module({
  command: "alive",
  package: "general",
  description: "Check if bot is alive",
})(async (message) => {
  try {
    const hostname = os.hostname();
    // Indian Time
    const time = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false, // 24-hour format
    });

    const ramUsedMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const caption = `
*- Yᴏᴜʀ ɢᴏʟᴜ-ᴍᴏʟᴜ xᴍᴅ ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ. 💀* 

  *[ᴛɪᴍᴇ]: ${time}*

  *[Hᴏꜱᴛ]: Nᴀꜱᴀ Qᴜᴀɴᴛᴜᴍ Cᴏᴍᴘᴜᴛᴇʀ*

  *[Rᴀᴍ ᴜꜱᴀɢᴇ]: ${ramUsedMB} ᴍʙ*

  *[Rᴜɴᴛɪᴍᴇ]: ${hours}h ${minutes}m*

  *[Dᴇᴠ]:t.me/Zoroxbug*

     *- Hᴀᴠᴇ ᴀ sᴇxʏ ᴅᴀʏ. 💋*
    `.trim();

    const opts = {
      image: { url: "https://i.ibb.co/0yrffJpc/image.jpg" },
      caption: caption,
      mimetype: "image/jpeg",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363404737630340@newsletter",
          newsletterName: "𝐃 𝐇 — ا 𝐘",
          serverMessageId: 6,
        },
      },
    };

    await message.conn.sendMessage(message.from, opts);
  } catch (err) {
    console.error("*❌ ᴀʟɪᴠᴇ ᴄᴏᴍᴍᴀɴᴅ ᴇʀʀᴏʀ*", err);
    await message.conn.sendMessage(message.from, {
      text: `❌ Error: ${err?.message || err}`,
    });
  }
});
