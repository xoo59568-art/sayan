// plugins/antilink.js  — FIXED VERSION
import { Module } from "../lib/plugins.js";
import { db } from "../lib/client.js";

const DEBUG = false; // set true to see console.debug logs
const debug = (...args) => DEBUG && console.debug('[antilink]', ...args);

// Regex: catches WhatsApp invites, Telegram, Discord, common URLs, bare domains
const LINK_REGEX = /(?:https?:\/\/[^\s]+)|(?:chat\.whatsapp\.com\/[A-Za-z0-9_-]+)|(?:wa\.me\/[0-9]+)|(?:t\.me\/[A-Za-z0-9_\-]+)|(?:telegram\.me\/[A-Za-z0-9_\-]+)|(?:discord\.gg\/[A-Za-z0-9_\-]+)|(?:bit\.ly\/[A-Za-z0-9_\-]+)|(?:tinyurl\.com\/[A-Za-z0-9_\-]+)|\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|gg|xyz|me|app|online|site|link)\b/gi;

/**
 * FIX: Use conn.sessionId (same key client.js uses for db).
 * client.js stores antilink keys under sessionId, not phone number.
 */
function getSessionId(conn) {
  if (!conn) return "unknown";
  if (conn.sessionId) return String(conn.sessionId);
  if (conn.id) return String(conn.id);
  const id = conn?.user?.id || conn?.user?.jid || conn?.user || null;
  if (!id) return "unknown";
  return String(id).split("@")[0];
}

// DB key helpers — scoped per group so each group has its own antilink state
function enabledKeyFor(groupJid) { return `antilink:${groupJid}:enabled`; }
function modeKeyFor(groupJid) { return `antilink:${groupJid}:mode`; }

// ---------- Command handler ----------
Module({
  command: "antilink",
  package: "owner",
  description: "*ᴇɴᴀʙʟᴇ / ᴅɪꜱᴀʙʟᴇ ᴀɴᴛɪ-ʟɪɴᴋ ꜰᴏʀ ᴛʜɪꜱ ɢʀᴏᴜᴘ ᴏʀ ꜱᴇᴛ ᴍᴏᴅᴇ (ᴋɪᴄᴋ / ɴᴜʟʟ / ᴡᴀʀɴ).* Default mode: kick",
})(async (message, match) => {
  try {
    if (!(message.isFromMe || message.isfromMe)) {
      return message.send("*ᴏᴡɴᴇʀ ᴏɴʟʏ `ᴄᴏᴍᴍᴀɴᴅꜱ`*");
    }
    if (!message.isGroup) return message.send("*ɢʀᴏᴜᴘ ᴏɴʟʏ `ᴄᴏᴍᴍᴀɴᴅꜱ`*.");
    await message.loadGroupInfo?.();

    const sessionId = getSessionId(message.conn);
    const groupJid = message.from;
    const raw = (match || "").trim().toLowerCase();

    const enabledKey = enabledKeyFor(groupJid);
    const modeKey = modeKeyFor(groupJid);

    // Show current status
    if (!raw) {
      const isEnabled = db.get(sessionId, enabledKey, false) === true;
      const mode = String(db.get(sessionId, modeKey, "kick") || "kick").toLowerCase();
      return message.send(
        `⚙️ *ɢʀᴏᴜᴘ ᴀɴᴛɪʟɪɴᴋ*\n• Status: ${isEnabled ? "✅ ON" : "❌ OFF"}\n• Mode: *${mode.toUpperCase()}*\n\n*ᴜꜱᴀɢᴇ:*\n• .antilink on\n• .antilink off\n• .antilink kick\n• .antilink null\n• .antilink warn`
      );
    }

    // ON
    if (raw === "on") {
      const already = db.get(sessionId, enabledKey, false) === true;
      if (already) return message.send("ℹ️ AntiLink is already *ON* for this group.");
      db.setHot(sessionId, enabledKey, true);
      // ensure a mode is set
      const currentMode = db.get(sessionId, modeKey, null);
      if (currentMode === null || currentMode === undefined) {
        db.setHot(sessionId, modeKey, "kick");
      }
      const activeMode = String(db.get(sessionId, modeKey, "kick")).toUpperCase();
      return message.send(`✅ *ᴀɴᴛɪʟɪɴᴋ ʜᴀꜱ ʙᴇᴇɴ ᴇɴᴀʙʟᴇᴅ ꜰᴏʀ ᴛʜɪꜱ ɢʀᴏᴜᴘ.*\nDefault action: *${activeMode}*`);
    }

    // OFF
    if (raw === "off") {
      const currently = db.get(sessionId, enabledKey, false) === true;
      if (!currently) return message.send("*ᴀɴᴛɪʟɪɴᴋ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴏꜰꜰ ꜰᴏʀ ᴛʜɪꜱ ɢʀᴏᴜᴘ.*");
      db.setHot(sessionId, enabledKey, false);
      return message.send("✅ *ᴀɴᴛɪʟɪɴᴋ ʜᴀꜱ ʙᴇᴇɴ ᴅɪꜱᴀʙʟᴇᴅ ꜰᴏʀ ᴛʜɪꜱ ɢʀᴏᴜᴘ*");
    }

    // Set mode: kick / null / warn / remove
    if (["kick", "null", "warn", "remove"].includes(raw)) {
      const normalized = raw === "remove" ? "kick" : raw;
      db.setHot(sessionId, modeKey, normalized);
      const isEnabled = db.get(sessionId, enabledKey, false) === true;
      if (!isEnabled) {
        db.setHot(sessionId, enabledKey, true);
        return message.send(`✅ *ᴀɴᴛɪʟɪɴᴋ ᴍᴏᴅᴇ ꜱᴇᴛ ᴛᴏ* *${normalized.toUpperCase()}* *ᴀɴᴅ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ᴇɴᴀʙʟᴇᴅ.*`);
      }
      return message.send(`✅ *ᴀɴᴛɪʟɪɴᴋ ᴍᴏᴅᴇ ᴜᴘᴅᴀᴛᴇᴅ ᴛᴏ* *${normalized.toUpperCase()}* *ꜰᴏʀ ᴛʜɪꜱ ɢʀᴏᴜᴘ.*`);
    }

    return message.send("*ᴜꜱᴀɢᴇ:*\n_.antilink on_\n_.antilink off_\n_.antilink kick_\n_.antilink null_\n_.antilink warn_");
  } catch (err) {
    console.error("[antilink][command] error", err);
    return message.send("❌ An error occurred while processing the command.");
  }
});

// ---------- Enforcement handler ----------
Module({ on: "text", package: "group", description: "Enforce anti-link policy in groups" })(
  async (message) => {
    try {
      if (!message || !message.isGroup) return;
      const body = (message.body || "").toString();
      if (!body) return;

      const sessionId = getSessionId(message.conn);
      const groupJid = message.from;

      const enabledKey = enabledKeyFor(groupJid);
      const modeKey = modeKeyFor(groupJid);

      // strict check: must be exactly true
      const enabled = (() => {
        try { return db.get(sessionId, enabledKey, false) === true; }
        catch (e) { console.error("[antilink] db.get failed", e); return false; }
      })();
      if (!enabled) return;

      // load group metadata for admin checks
      try { await message.loadGroupInfo?.(); } catch (e) { debug("loadGroupInfo failed", e?.message || e); }

      const botIsAdmin = !!message.isBotAdmin;
      const senderIsAdmin = !!message.isAdmin;
      const senderIsOwnerOrFromMe = !!(message.isFromMe || message.isfromMe);

      // bot must be admin to take action
      if (!botIsAdmin) {
        debug("bot not admin -> cannot enforce");
        return;
      }
      // skip admins and bot owner
      if (senderIsAdmin || senderIsOwnerOrFromMe) {
        debug("sender is admin/owner/bot -> ignoring");
        return;
      }

      const matches = body.match(LINK_REGEX);
      if (!matches || matches.length === 0) return;
      debug("links detected", matches);

      // get mode
      let mode = "kick";
      try {
        mode = String(db.get(sessionId, modeKey, "kick") || "kick").toLowerCase();
      } catch (e) {
        debug("error reading mode, defaulting to kick", e?.message || e);
      }
      debug("mode=", mode);

      // ── DELETE the offending message first ──
      let deleted = false;
      try {
        if (typeof message.conn?.sendMessage === "function") {
          await message.conn.sendMessage(message.from, { delete: message.key });
          deleted = true;
          debug("message deleted via conn.sendMessage");
        } else if (typeof message.send === "function") {
          await message.send({ delete: message.key });
          deleted = true;
          debug("message deleted via message.send");
        }
      } catch (e) {
        debug("delete attempt threw", e?.message || e);
      }

      const senderJid = message.sender || message.key?.participant || message.key?.from || null;
      const senderNum = senderJid ? String(senderJid).split("@")[0] : "unknown";
      const mentions = senderJid ? [senderJid] : [];

      // ── Null / remove_link: delete + notify only ──
      if (mode === "null" || mode === "remove_link") {
        try {
          await message.send?.(
            `🔗 *ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ ᴀɴᴅ ʀᴇᴍᴏᴠᴇᴅ* ꜰʀᴏᴍ @${senderNum}`,
            { mentions }
          );
        } catch (e) { debug("notify failed", e?.message || e); }
        return;
      }

      // ── Warn: delete + warn user ──
      if (mode === "warn") {
        try {
          await message.send?.(
            `⚠️ @${senderNum} *ᴘᴏꜱᴛɪɴɢ ʟɪɴᴋꜱ ɪꜱ ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ ʜᴇʀᴇ. ᴛʜɪꜱ ɪꜱ ᴀ ᴡᴀʀɴɪɴɢ.*`,
            { mentions }
          );
        } catch (e) { debug("warn failed", e?.message || e); }
        return;
      }

      // ── Kick/Remove: delete + notify + remove participant ──
      if (mode === "kick" || mode === "remove") {
        // send notice first
        try {
          await message.send?.(
            `🚫 @${senderNum} *ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ — ᴍᴇꜱꜱᴀɢᴇ ʀᴇᴍᴏᴠᴇᴅ ᴀɴᴅ ᴜꜱᴇʀ ᴋɪᴄᴋᴇᴅ.*`,
            { mentions }
          );
        } catch (e) { debug("notice failed", e?.message || e); }

        // short delay so notice is delivered
        await new Promise((r) => setTimeout(r, 600));

        // remove participant
        try {
          if (typeof message.removeParticipant === "function") {
            await message.removeParticipant([senderJid]);
            debug("removeParticipant succeeded", senderJid);
          } else if (message.conn && typeof message.conn.groupParticipantsUpdate === "function") {
            await message.conn.groupParticipantsUpdate(message.from, [senderJid], "remove");
            debug("groupParticipantsUpdate succeeded", senderJid);
          } else {
            throw new Error("no supported remove function available");
          }
        } catch (err) {
          console.error("[antilink] failed to remove participant", err);
          try {
            await message.send?.(
              `❌ @${senderNum} ᴋɪᴄᴋ ꜰᴀɪʟᴇᴅ — ᴘʟᴇᴀꜱᴇ ʀᴇᴍᴏᴠᴇ ᴍᴀɴᴜᴀʟʟʏ.`,
              { mentions }
            );
          } catch (e) { debug("notify admin failed", e?.message || e); }
        }
        return;
      }

      debug("unknown mode (no action)", mode);
    } catch (error) {
      console.error("[antilink] enforcement error:", error);
    }
  }
);
