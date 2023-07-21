let confirmation = {}
async function handler(m, {
    conn,
    args,
    usedPrefix,
    command
}) {
    if (confirmation[m.sender]) return m.reply('Kamu sedang meminta sumbangan!')
    let user = global.db.data.users
    const count = args[0]
    if (!count) return m.reply("⚠️ Masukkan angka jumlah sumbangan.")
    if (isNaN(count)) return m.reply("⚠️ Jumlah sumbangan harus berupa angka.")
    if (user[m.sender].money < count) return m.reply("😔 Maaf, saldo Anda tidak cukup untuk melakukan sumbangan sebesar itu.")
    let txt = `Apakah kamu yakin ingin memberi sumbangan\n✅ (Yes) ❌ (No)`
    let confirm = `😔 Kak bagi sumbangan Rp.${count.toLocaleString()} dong.\n\n${txt}`;
    conn.reply(m.chat, confirm, m, {
        mentions: [m.sender]
    })
    confirmation[m.sender] = {
        sender: m.sender,
        message: m,
        count,
        timeout: setTimeout(() => (m.reply('Timeout'), delete confirmation[m.sender]), 60 * 1000)
    }
}

handler.before = async m => {
    if (m.isBaileys) return
    if (!(m.sender in confirmation)) return
    if (!m.text) return
    let {
        timeout,
        sender,
        message,
        count
    } = confirmation[m.sender]
    if (m.id === message.id) return
    let user = global.db.data.users[m.sender]
    let _user = global.db.data.users[sender]
    if (m.sender == sender) return m.reply("⚠️ Tidak bisa meminta sumbangan ke diri anda sendiri!.")
    if (/(✔️|y(es)?)/g.test(m.text.toLowerCase())) {
        user.money -= count * 1
        _user.money += count * 1
        m.reply(`✨ Terima kasih!\n${m.name.split('\n')[0]} telah memberi sumbangan sebesar Rp.${count.toLocaleString()}`)
        clearTimeout(timeout)
        delete confirmation[sender]
    }
    if (/(✖️|n(o)?)/g.test(m.text.toLowerCase())) {
        m.reply(`😔 ${m.name.split('\n')[0]} kamu pelit banget kak...`)
        clearTimeout(timeout)
        delete confirmation[sender]
    }
}

handler.help = ['sumbangan'].map(v => v + ' [jumlah]')
handler.tags = ['rpg']
handler.command = /^(sumbangan)$/i
handler.disabled = false

export default handler

function isNumber(x) {
    return !isNaN(x)
}