import { Module } from "../lib/plugins.js";
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';

Module({
  command: "gstatus",
  aliases: ["groupstatus", "gs", "upset"],
  description: "Post group status using groupStatusMessageV2",
})(async (message, match) => {
  const { conn, jid, isGroup, sender, quoted, from } = message;

  try {
    if (!isGroup) return await message.send("*ɢʀᴏᴜᴘ `ᴄᴏᴍᴍᴀɴᴅꜱ`*");

    // 1. Permissions Check
    const isOwner = message.isfromMe || sender.includes('917365085213');
    const isAdmin = message.isAdmin || false; 

    if (!isAdmin && !isOwner) {
        return await message.send("❌*ᴀᴅᴍɪɴ ᴏʀ ᴏᴡɴᴇʀ ᴏɴʟʏ `ᴄᴏᴍᴍᴀɴᴅꜱ`*");
    }

    await message.react('⏳');

    // 2. Setup IDs
    const targetGroup = (jid || from || '').toString();
    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const text = match?.trim();

    let statusMessage = {};

    // 3. Handle Media (Image/Video)
    // We check if there's a quoted message with media
    const mime = (quoted?.msg || quoted)?.mimetype || "";
    
    if (quoted && /image|video/.test(mime)) {
        // Download the buffer from the quoted message
        const buffer = await quoted.download();
        
        // Prepare (Upload) the media to WhatsApp servers
        const mediaUpload = await prepareWAMessageMedia(
            { [/image/.test(mime) ? 'image' : 'video']: buffer },
            { upload: conn.waUploadToServer }
        );

        const mediaType = /image/.test(mime) ? 'imageMessage' : 'videoMessage';

        statusMessage = {
            [mediaType]: {
                ...mediaUpload[mediaType],
                caption: text || ""
            }
        };
    } 
    // 4. Handle Text Fallback
    else {
        statusMessage = {
            extendedTextMessage: {
                text: text || "*ɢᴏʟᴜ ᴍᴏʟᴜ xᴍᴅ ꜱᴛᴀᴛᴜꜱ*",
                matchedText: "https://ibb.co/WYNWBMx",
                paymentLinkMetadata: {
                    button: { displayText: "VIEW" },
                    header: { headerType: 1 }
                }
            }
        };
    }

    // 5. Generate and Relay
    const msg = generateWAMessageFromContent(targetGroup, statusMessage, {
        userJid: botJid,
        quoted: message.data 
    });

    await conn.relayMessage(targetGroup, {
        groupStatusMessageV2: {
            message: msg.message
        }
    }, { 
        messageId: null 
    });

    await message.react('✅');
    return await message.send("*ɢʀᴏᴜᴘ ꜱᴛᴀᴛᴜꜱ `ᴘᴏꜱᴛᴇᴅ`*");

  } catch (err) {
    console.error("[GSTATUS ERROR]", err);
    await message.react('❌');
    return await message.send(`❌ *ᴇʀʀᴏʀ:* ${err.message}`);
  }
});
