import { Module } from '../lib/plugins.js'
import Facebook from '../lib/Class/facebook.js'

Module({
  command: 'fb',
  package: 'downloader',
  description: 'Download Facebook videos'
})(async (message, match) => {

  // Command reply (no box)
  if (!match) {
    return message.send('*ᴘʀᴏᴠɪᴅᴇ ᴀ ꜰᴀᴄᴇʙᴏᴏᴋ `ᴜʀʟ`*')
  }

  if (
    !match.includes('facebook.com') &&
    !match.includes('fb.watch')
  ) {
    return message.send('*ɪɴᴠᴀʟɪᴅ ꜰᴀᴄᴇʙᴏᴏᴋ `ᴜʀʟ`*')
  }

  try {
    const fb = new Facebook()
    const result = await fb.download(match)

    if (result.status !== 200) {
      return message.send(`❌ ${result.message || result.error}`)
    }

    const dls = result.data || {}
    const qualities = Object.keys(dls)

    if (!qualities.length) {
      return message.send('*ɴᴏ ᴅᴏᴡɴʟᴏᴀᴅᴀʙʟᴇ ᴠɪᴅᴇᴏ `ꜰᴏᴜɴᴅ`*')
    }

    const qp =
      qualities.find(q => q.toUpperCase().includes('HD')) ||
      qualities[0]

    const downloadUrl = dls[qp]

    await message.send({
      video: { url: downloadUrl },
      caption:
        `> *ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ʙʏ ɢᴏʟᴜ-ᴍᴏʟᴜ xᴍᴅ*`
    })

  } catch (e) {
    console.error(e)
    return message.send('*ᴅᴏᴡɴʟᴏᴀᴅ `ꜰᴀɪʟᴇᴅ`*')
  }
})
