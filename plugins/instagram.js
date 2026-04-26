import { Module } from '../lib/plugins.js'
import instaSave from './bin/instagram.js'

Module({
  command: 'insta',
  package: 'downloader',
  description: 'Download Instagram photo/video'
})(async (message, match) => {

  if (!match) {
    return message.send(
      '*ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀɴ ɪɴꜱᴛᴀɢʀᴀᴍ `ʟɪɴᴋ`*'
    )
  }

  try {
    const d = await instaSave(match)
    if (!d) return message.send('*ɴᴏ ᴍᴇᴅɪᴀ ꜰᴏᴜɴᴅ ᴏʀ ᴀᴘɪ `ᴇʀʀᴏʀ`*')

    const caption =
      '> *ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ʙʏ ɢᴏʟᴜ ᴍᴏʟᴜ-xᴍᴅ*'

    if (d.MP4) {
      return message.send({ video: { url: d.MP4 }, caption })
    }

    if (d.JPEG) {
      return message.send({ image: { url: d.JPEG }, caption })
    }

    return message.send('❌ Unsupported post type')

  } catch (e) {
    console.error(e)
    return message.send('*ᴇʀʀᴏʀ `ᴏᴄᴄᴜʀʀᴇᴅ`*')
  }
})
