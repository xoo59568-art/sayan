import { Module } from '../lib/plugins.js';

Module({
  command: "pair",
  package: "main",
  description: "Instruct user to pair via Telegram Bot with fixed image",
})(async (message, match) => {
  try {
    const _cmd_st = `*ʜᴇʏ* 

*ᴘᴀɪʀ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ ᴠɪᴀ ᴛᴇʟᴇɢʀᴀᴍ ʙᴏᴛ.* 

*ʙᴏᴛ ʟɪɴᴋ -  https://t.me/golu_moluxmd_bot*

*Owner - https://t.me/Zoroxbug*`.trim();

    const opts = {
      image: { url: "https://i.ibb.co/0yrffJpc/image.jpg" },
      caption: _cmd_st,
      mimetype: "image/jpeg",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363424694018029@newsletter",
          newsletterName: "─【 𝐃 𝐇 — ا 𝐘 】─",
          serverMessageId: 6,
        },
      },
    };

    await message.conn.sendMessage(message.from, opts);
  } catch (err) {
    console.error("❌ Pair command error:", err);
    await message.conn.sendMessage(message.from, {
      text: `❌ Error: ${err?.message || err}`,
    });
  }
});
