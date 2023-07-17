import fetch from 'node-fetch'

let handler = async(m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Example : ${usedPrefix + command} neon helo \n*List Efek:*\nhusbu\nlatestnekopoi\nloli\nneko\nrandomnhentai\nwaifu`)
        let images = global.API('xcdr', '/api/anime', { text }, 'apikey')
        let caption = `*⎔┉━「 Animex 」━┉⎔*\n🤠 *Query* : ${text}`
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        let pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom())
        let name = await conn.getName(who)
                await conn.sendFile(m.chat, await(await fetch(images)).buffer(), '', caption, m, { quoted: fakes, fileLength: fsizedoc, seconds: fsizedoc, contextInfo: {
          externalAdReply :{
          showAdAttribution: true,
    mediaUrl: sig,
    mediaType: 2,
    description: wm, 
    title: '👋 Hai, ' + name,
    body: botdate,
    thumbnail: await( await fetch(pp)).buffer(),
    sourceUrl: sgc }}})
}
handler.help = ['animex <text>']
handler.tags = ['maker']
handler.command = /^(animex|animeimg)$/i

export default handler