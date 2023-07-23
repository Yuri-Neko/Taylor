let typing = {}

export async function before(m) {
    let chat = global.db.data.chats[m.chat]
    let prefix = global.prefix || /^([.!#])/
    
    if (chat.autoPesence) {
        if (prefix.test(m.text)) {
            /* MeReact jika ada kemiripan dengan help */
            let help = Object.values(plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1)
            let noPrefix = m.text.replace(prefix, '')
            if (help.some(h => h.includes(noPrefix))) {
                this.sendMessage(m.chat, {
                    react: {
                        text: '⌛',
                        key: m.key,
                    }
                })
            }
        } else {
            /* Cek apakah ada teks baru atau teks diulang */
            if (m.sender in typing) {
                clearTimeout(typing[m.sender])
                delete typing[m.sender]
                /* Presence (Composing) dihapus karena ada teks baru */
                this.sendPresenceUpdate('composing', m.chat)
            } else {
                /* Tandai bahwa ada teks di m.chat untuk menghindari tampilan ulang presence */
                typing[m.sender] = setTimeout(() => {
                    delete typing[m.sender]
                    /* Presence (Recording) dihapus karena tidak ada teks baru */
                    this.sendPresenceUpdate('recording', m.chat)
                }, 3000) // Sesuaikan dengan waktu yang diinginkan (dalam milidetik)
            }
        }
    }
}

export const disabled = false
