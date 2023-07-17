let handler = async(m, { conn, text, usedPrefix, command }) => {
        let res = global.API('xcdr', '/api/random/gore', {}, 'apikey')
await conn.sendFile(m.chat, res, "", "", m)
}
handler.help = ['gore2']
handler.tags = ['fun']
handler.command = /^(gore2)$/i

export default handler