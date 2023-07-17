let handler = (m, { conn, usedPrefix, command, text }) => {
  conn.tembak = conn.tembak || { musuh: [], tembak: [] }
   if(/kiri/i.test(text)) {

    let kiri = [
      ["🤠", "・", "・", "・", "・", "・"],
      ["・", "🤠", "・", "・", "・", "・"],
      ["・", "・", "🤠", "・", "・", "・"],
      ["・", "・", "・", "🤠", "・", "・"],
      ["・", "・", "・", "・", "🤠", "・"],
      ["・", "・", "・", "・", "・", "🤠"]
    ]

    if(conn.tembak.tembak.indexOf("🤠") == 0) {
      conn.tembak.tembak = kiri[0]
    } else if(conn.tembak.tembak.indexOf("🤠") == 1) {
      conn.tembak.tembak = kiri[0]
    } else if(conn.tembak.tembak.indexOf("🤠") == 2) {
      conn.tembak.tembak = kiri[1]
    } else if(conn.tembak.tembak.indexOf("🤠") == 3) {
      conn.tembak.tembak = kiri[2]
    } else if(conn.tembak.tembak.indexOf("🤠") == 4) {
      conn.tembak.tembak = kiri[3]
    } else if(conn.tembak.tembak.indexOf("🤠") == 5) {
      conn.tembak.tembak = kiri[4]
    }

    let pos = conn.tembak.musuh.join(" ") + "\n\n\n" + conn.tembak.tembak.join(" ")



    if(conn.tembak.musuh.indexOf("🥷") === conn.tembak.tembak.indexOf("🤠")) return conn.reply(m.chat, pos + '\n' + `🔫 Tembak\n${usedPrefix}koboy tembak`, null)
    return conn.reply(m.chat, pos + '\n' + `${usedPrefix}koboy kiri\n${usedPrefix}koboy kanan`, null)
  } else if(/kanan/i.test(text)) {

    let kanan = [
      ["🤠", "・", "・", "・", "・", "・"],
      ["・", "🤠", "・", "・", "・", "・"],
      ["・", "・", "🤠", "・", "・", "・"],
      ["・", "・", "・", "🤠", "・", "・"],
      ["・", "・", "・", "・", "🤠", "・"],
      ["・", "・", "・", "・", "・", "🤠"]
    ]

    if(conn.tembak.tembak.indexOf("🤠") == 0) {
      conn.tembak.tembak = kanan[1]
    } else if(conn.tembak.tembak.indexOf("🤠") == 1) {
      conn.tembak.tembak = kanan[2]
    } else if(conn.tembak.tembak.indexOf("🤠") == 2) {
      conn.tembak.tembak = kanan[3]
    } else if(conn.tembak.tembak.indexOf("🤠") == 3) {
      conn.tembak.tembak = kanan[4]
    } else if(conn.tembak.tembak.indexOf("🤠") == 4) {
      conn.tembak.tembak = kanan[5]
    } else if(conn.tembak.tembak.indexOf("🤠") == 5) {
      conn.tembak.tembak = kanan[5]
    }

    let pos = conn.tembak.musuh.join(" ") + "\n\n\n" + conn.tembak.tembak.join(" ")



    if(conn.tembak.musuh.indexOf("🥷") === conn.tembak.tembak.indexOf("🤠")) return conn.reply(m.chat, pos + '\n' + `🔫 Tembak\n${usedPrefix}koboy tembak`, null)
    return conn.reply(m.chat, pos + '\n' + `${usedPrefix}koboy kiri\n${usedPrefix}koboy kanan`, null)
  } else if(/tembak/i.test(text)) {

    if(conn.tembak.tembak.indexOf("🤠") == conn.tembak.musuh.indexOf("🥷")) {
      conn.tembak = {}
      global.db.data.users[m.sender].money += 1000
      m.reply("Kamu menang!\n\nUang += 1000")
    }

  } else {
   let randMusuh = [
      ["🥷", "・", "・", "・", "・", "・"],
      ["・", "🥷", "・", "・", "・", "・"],
      ["・", "・", "🥷", "・", "・", "・"],
      ["・", "・", "・", "🥷", "・", "・"],
      ["・", "・", "・", "・", "🥷", "・"],
      ["・", "・", "・", "・", "・", "🥷"]
    ]
   let randAku = [
      ["🤠", "・", "・", "・", "・", "・"],
      ["・", "🤠", "・", "・", "・", "・"],
      ["・", "・", "🤠", "・", "・", "・"],
      ["・", "・", "・", "🤠", "・", "・"],
      ["・", "・", "・", "・", "🤠", "・"],
      ["・", "・", "・", "・", "・", "🤠"]
    ]

    let musuh = random(randMusuh)
   let aku = random(randAku)

    conn.tembak.musuh = musuh
    conn.tembak.tembak = aku

    let pos = conn.tembak.musuh.join(" ") + "\n\n\n" + conn.tembak.tembak.join(" ")

    if(conn.tembak.musuh.indexOf("🥷") === conn.tembak.tembak.indexOf("🤠")) return conn.reply(m.chat, pos + '\n' + `🔫 Tembak\n${usedPrefix}koboy tembak`, null)
    return conn.reply(m.chat, pos + '\n' + `${usedPrefix}koboy kiri\n${usedPrefix}koboy kanan`, null)
  }
}
handler.help = ['koboy']
handler.tags = ['rpg']
handler.command = /^(koboy|coboy)/i

export default handler


function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}