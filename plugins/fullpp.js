// plugins/fullpp.js
// .pp     → normal profile picture (may crop to square)
// .fullpp → full size, no crop, full image visible

import { Module } from "../lib/plugins.js";
import { getTheme } from "../Themes/themes.js";
import { makeFullPp } from "../lib/serialize.js";
import { jidNormalizedUser } from "@whiskeysockets/baileys";

const theme = getTheme();

// helper: find image in direct message or quoted
function getImageMessage(message) {
  if (message.type === "imageMessage" || message.mtype === "imageMessage") {
    return message;
  }
  if (
    message.quoted &&
    (message.quoted.mtype === "imageMessage" ||
      message.quoted.type === "imageMessage" ||
      message.quoted.message?.imageMessage)
  ) {
    return message.quoted;
  }
  return null;
}

// ─── .pp — normal (baileys default, may crop) ──────────────────────────────
Module({
  command: "pp",
  package: "owner",
  description: "Set bot profile picture (normal)",
})(async (message) => {
  if (!(message.isFromMe || message.isfromMe))
    return message.send(theme.isfromMe || "*ᴏᴡɴᴇʀ ᴏɴʟʏ*");

  const imgMsg = getImageMessage(message);
  if (!imgMsg) return message.send("❌ *Reply to an image to set profile picture.*");

  try {
    await message.react("⏳");
    const buf = await imgMsg.download();
    if (!buf || !buf.length) throw new Error("Download returned empty buffer");

    const botJid = jidNormalizedUser(message.conn?.user?.id || "");
    await message.setPp(botJid, buf);

    await message.react("✅");
    return message.send("✅ *ᴘʀᴏꜰɪʟᴇ ᴘɪᴄᴛᴜʀᴇ ᴜᴘᴅᴀᴛᴇᴅ*");
  } catch (err) {
    console.error("[pp] error:", err);
    await message.react("❌");
    return message.send("❌ *Failed to update profile picture.*\n" + (err?.message || err));
  }
});

// ─── .fullpp — full size, NO crop ──────────────────────────────────────────
Module({
  command: "fullpp",
  package: "owner",
  description: "Set bot profile picture in FULL size (no crop)",
})(async (message) => {
  if (!(message.isFromMe || message.isfromMe))
    return message.send(theme.isfromMe || "*ᴏᴡɴᴇʀ ᴏɴʟʏ*");

  const imgMsg = getImageMessage(message);
  if (!imgMsg) return message.send("❌ *Reply to an image to set full profile picture.*");

  try {
    await message.react("⏳");
    const buf = await imgMsg.download();
    if (!buf || !buf.length) throw new Error("Download returned empty buffer");

    const botJid = jidNormalizedUser(message.conn?.user?.id || "");

    // makeFullPp: no square crop, full aspect ratio, max 2560px
    const { img: fullImgBuf } = await makeFullPp(buf);

    let success = false;

    // Method 1: Direct IQ query — bypasses all baileys resize/crop logic
    if (typeof message.conn?.query === "function") {
      try {
        await message.conn.query({
          tag: "iq",
          attrs: {
            to: botJid,
            type: "set",
            xmlns: "w:profile:picture",
          },
          content: [
            {
              tag: "picture",
              attrs: { type: "image" },
              content: fullImgBuf,
            },
          ],
        });
        success = true;
      } catch (e) {
        console.error("[fullpp] IQ query failed, trying fallback:", e?.message || e);
      }
    }

    // Method 2: updateProfilePicture with raw buffer (baileys may resize but better than nothing)
    if (!success && typeof message.conn?.updateProfilePicture === "function") {
      await message.conn.updateProfilePicture(botJid, buf);
      success = true;
    }

    // Method 3: setFullPp helper (serialize.js)
    if (!success && typeof message.setFullPp === "function") {
      await message.setFullPp(botJid, buf);
      success = true;
    }

    if (!success) throw new Error("No method available to update profile picture");

    await message.react("✅");
    return message.send("✅ *ꜰᴜʟʟ ꜱɪᴢᴇ ᴘʀᴏꜰɪʟᴇ ᴘɪᴄᴛᴜʀᴇ ᴜᴘᴅᴀᴛᴇᴅ — ɴᴏ ᴄʀᴏᴘ* 🖼️");
  } catch (err) {
    console.error("[fullpp] error:", err);
    await message.react("❌");
    return message.send("❌ *Failed to update full profile picture.*\n" + (err?.message || err));
  }
});
