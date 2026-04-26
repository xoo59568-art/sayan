import { Module } from "../lib/plugins.js";
import config from "../config.js";
import { getTheme } from "../Themes/themes.js";
import { db } from "../lib/client.js";

const theme = getTheme();

/**
 * FIX: resolveBotNumber must return sessionId (conn.sessionId),
 * because client.js stores ALL keys under sessionId (not botNumber/phone).
 * Fallback chain: conn.sessionId -> conn.id -> conn.user.id (stripped)
 */
function resolveBotNumber(conn) {
  if (!conn) return null;
  // PRIMARY: sessionId is what client.js uses for db keys
  if (conn.sessionId) return String(conn.sessionId);
  // FALLBACK: conn.id if set directly
  if (conn.id) return String(conn.id);
  // LAST RESORT: strip user id
  if (conn.user && conn.user.id) return String(conn.user.id).split(":")[0].split("@")[0];
  return null;
}

// 🔹 Auto Status Seen
Module({
  command: "autostatus",
  package: "owner",
  description: "Toggle auto view WhatsApp status",
})(async (message, match) => {
  if (!message.isFromMe) return message.send(theme.isfromMe);
  const sessionId = resolveBotNumber(message.conn);
  if (!sessionId) return message.send("❌ Bot session not found.");

  const input = match?.trim().toLowerCase();
  const key = "autostatus_seen";

  if (input === "on" || input === "off") {
    await message.react("⏳");
    try {
      if (input === "on") db.setHot(sessionId, key, true);
      else db.delHot(sessionId, key);
      await message.react("✅");
      return await message.send(
        `✅ *ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ ɪꜱ ɴᴏᴡ \`${input.toUpperCase()}\`*`
      );
    } catch (e) {
      await message.react("❌");
      return await message.send("❌ *Error updating auto status view*");
    }
  }

  const status = db.get(sessionId, key, false) === true;
  return await message.send(
    `⚙️ *ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ*\n> ꜱᴛᴀᴛᴜꜱ: ${
      status ? "✅ _ᴏɴ_" : "❌ _ᴏꜰꜰ_"
    }\n\nUse:\n• autostatus on\n• autostatus off`
  );
});

// 🔹 Auto Typing
Module({
  command: "autotyping",
  package: "owner",
  description: "Toggle auto typing in chats",
})(async (message, match) => {
  if (!message.isFromMe) return message.send(theme.isfromMe);
  const sessionId = resolveBotNumber(message.conn);
  if (!sessionId) return message.send("❌ Bot session not found.");

  const input = match?.trim().toLowerCase();
  const key = "autotyping";

  if (input === "on" || input === "off") {
    await message.react("⏳");
    try {
      if (input === "on") db.setHot(sessionId, key, true);
      else db.delHot(sessionId, key);
      await message.react("✅");
      return await message.send(
        `✅ *ᴀᴜᴛᴏᴛʏᴘɪɴɢ ɪꜱ ɴᴏᴡ \`${input.toUpperCase()}\`*`
      );
    } catch (e) {
      await message.react("❌");
      return await message.send("❌ *Error updating auto typing*");
    }
  }

  const status = db.get(sessionId, key, false) === true;
  return await message.send(
    `⚙️ *ᴀᴜᴛᴏ ᴛʏᴘɪɴɢ*\n> ꜱᴛᴀᴛᴜꜱ: ${
      status ? "✅ _ᴏɴ_" : "❌ _ᴏꜰꜰ_"
    }\n\nUse:\n• autotyping on\n• autotyping off`
  );
});

// 🔹 Auto Recording
Module({
  command: "autorecord",
  package: "owner",
  description: "Toggle auto voice recording in chats",
})(async (message, match) => {
  if (!message.isFromMe) return message.send(theme.isfromMe);
  const sessionId = resolveBotNumber(message.conn);
  if (!sessionId) return message.send("❌ Bot session not found.");

  const input = match?.trim().toLowerCase();
  const key = "autorecord";

  if (input === "on" || input === "off") {
    await message.react("⏳");
    try {
      if (input === "on") db.setHot(sessionId, key, true);
      else db.delHot(sessionId, key);
      await message.react("✅");
      return await message.send(
        `✅ *ᴀᴜᴛᴏʀᴇᴄᴏʀᴅɪɴɢ ɪꜱ ɴᴏᴡ \`${input.toUpperCase()}\`*`
      );
    } catch (e) {
      await message.react("❌");
      return await message.send("❌ *Error updating auto record*");
    }
  }

  const status = db.get(sessionId, key, false) === true;
  return await message.send(
    `🎤 *ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅ*\n> ꜱᴛᴀᴛᴜꜱ: ${
      status ? "✅ _ᴏɴ_" : "❌ _ᴏꜰꜰ_"
    }\n\nUse:\n• autorecord on\n• autorecord off`
  );
});

// 🔹 Auto React to Messages
Module({
  command: "autoreact",
  package: "owner",
  description: "Toggle auto react to messages",
})(async (message, match) => {
  if (!message.isFromMe) return message.send(theme.isfromMe);
  const sessionId = resolveBotNumber(message.conn);
  if (!sessionId) return message.send("❌ Bot session not found.");

  const input = match?.trim().toLowerCase();
  // FIX: key was set to unicode text "ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ" — changed to ascii "autoreact" to match client.js
  const key = "autoreact";

  if (input === "on" || input === "off") {
    await message.react("⏳");
    try {
      if (input === "on") db.setHot(sessionId, key, true);
      else db.delHot(sessionId, key);
      await message.react("✅");
      return await message.send(
        `✅ *ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ ɪꜱ ɴᴏᴡ \`${input.toUpperCase()}\`*`
      );
    } catch (e) {
      await message.react("❌");
      return await message.send("❌ *Error updating AutoReact*");
    }
  }

  const status = db.get(sessionId, key, false) === true;
  return await message.send(
    `⚙️ *ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ*\n> ꜱᴛᴀᴛᴜꜱ: ${
      status ? "✅ _ᴏɴ_" : "❌ _ᴏꜰꜰ_"
    }\n\nUse:\n• autoreact on\n• autoreact off`
  );
});

// 🔹 Anti Call
Module({
  command: "anticall",
  package: "owner",
  description: "Block users who call the bot",
})(async (message, match) => {
  if (!message.isFromMe) return message.send(theme.isfromMe);
  const sessionId = resolveBotNumber(message.conn);
  if (!sessionId) return message.send("❌ Bot session not found.");

  const input = match?.trim().toLowerCase();
  const key = "anticall";

  if (input === "on" || input === "off") {
    await message.react("⏳");
    try {
      // FIX: client.js checks anticallData.anticall === "true" (string),
      // so store as string "true"/"false"
      if (input === "on") db.setHot(sessionId, key, { anticall: "true" });
      else db.delHot(sessionId, key);
      await message.react("✅");
      return await message.send(
        `✅ *ᴀɴᴛɪᴄᴀʟʟ ɪꜱ ɴᴏᴡ \`${input.toUpperCase()}\`*`
      );
    } catch (e) {
      await message.react("❌");
      return await message.send("❌ *Error updating AntiCall*");
    }
  }

  const anticallData = db.get(sessionId, key) || {};
  const status = anticallData?.anticall === "true";
  return await message.send(
    `⚙️ *ᴀɴᴛɪᴄᴀʟʟ*\n> ꜱᴛᴀᴛᴜꜱ: ${
      status ? "✅ _ᴏɴ_" : "❌ _ᴏꜰꜰ_"
    }\n\nUse:\n• anticall on\n• anticall off`
  );
});

// 🔹 Auto Read
Module({
  command: "autoread",
  package: "owner",
  description: "Toggle auto read messages",
})(async (message, match) => {
  if (!message.isFromMe) return message.send(theme.isfromMe);
  const sessionId = resolveBotNumber(message.conn);
  if (!sessionId) return message.send("❌ Bot session not found.");

  const input = match?.trim().toLowerCase();
  const key = "autoread";

  if (input === "on" || input === "off") {
    await message.react("⏳");
    try {
      if (input === "on") db.setHot(sessionId, key, true);
      else db.delHot(sessionId, key);
      await message.react("✅");
      return await message.send(
        `✅ *ᴀᴜᴛᴏʀᴇᴀᴅ ɪꜱ ɴᴏᴡ \`${input.toUpperCase()}\`*`
      );
    } catch (e) {
      await message.react("❌");
      return await message.send("❌ *Error updating AutoRead*");
    }
  }

  const status = db.get(sessionId, key, false) === true;
  return await message.send(
    `⚙️ *ᴀᴜᴛᴏʀᴇᴀᴅ*\n> ꜱᴛᴀᴛᴜꜱ: ${
      status ? "✅ _ᴏɴ_" : "❌ _ᴏꜰꜰ_"
    }\n\nUse:\n• autoread on\n• autoread off`
  );
});

// 🔹 Bot Mode
Module({
  command: "mode",
  package: "owner",
  description: "Toggle bot mode (public / private)",
})(async (message, match) => {
  if (!message.isFromMe) return message.send(theme.isfromMe);

  const sessionId = resolveBotNumber(message.conn);
  if (!sessionId) return message.send("❌ Bot session not found.");

  const input = match?.trim().toLowerCase();
  const key = "mode";

  if (input === "public" || input === "private") {
    await message.react("⏳");
    try {
      db.setHot(sessionId, key, input === "public" ? true : false);
      await message.react("✅");
      return message.send(
        `✅ *ʙᴏᴛ ᴍᴏᴅᴇ ꜱᴇᴛ ᴛᴏ* \`${input.toUpperCase()}\``
      );
    } catch (err) {
      await message.react("❌");
      return message.send("❌ *Failed to update bot mode*");
    }
  }

  const isPublic = db.get(sessionId, key, true) === true;
  return message.send(
    `⚙️ *ʙᴏᴛ ᴍᴏᴅᴇ*\n` +
    `> Status: ${isPublic ? "🌐 *ᴘᴜʙʟɪᴄ*" : "🔒 *ᴘʀɪᴠᴀᴛᴇ*"}\n\n` +
    `*ᴜꜱᴀɢᴇ :*\n` +
    `• mode public\n` +
    `• mode private`
  );
});
