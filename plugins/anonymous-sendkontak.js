let { MessageType, Presence } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { command, conn, text }) => {
	this.anonymous = this.anonymous ? this.anonymous : {}
	let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
	let room = Object.values(this.anonymous).find(room => room.check(who))
	if (!room) throw 'kamu tidak berada di anonymous chat'
	let other = room.other(who)
  var name
  if (text) name = text
  else name = conn.getName(m.sender)
	var number = who.split('@')[0]
	let tks = `➔ Nomor: ${m.sender.split`@`[0]}
➔ Nama: ${name}`
    this.reply(m.chat, 'Menggirimkan Kontak...')
	if (other) this.reply(other, `Partner mengirimkan kontak kepadamu`)
	if (other) this.sendFile(other, await conn.profilePictureUrl(m.sender, 'image').catch(_ => './thumbnail.jpg'), '', `${htki} ᴀɴᴏɴʏᴍᴏᴜs ᴄʜᴀᴛs ${htka}` + tks, m, {mentions: [m.sender]})
}
handler.help = ['sendkontak']
handler.tags = 'anonymous'
handler.command = /^(sendkontak)$/i
handler.private = true

export default handler