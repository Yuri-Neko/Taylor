let optionsData = {};

async function handler(m, { conn, usedPrefix, args }) {
  const idop = [
    "antiDelete", "antiLink", "antiLinkFb", "antiLinkHttp", "antiLinkIg", "antiLinkTel",
    "antiLinkTik", "antiLinkWa", "antiLinkYt", "antiSatir", "antiSticker", "antiVirtex", "antiToxic",
    "antibule", "autoBio", "autoJoin", "autoPesence", "autoReply", "autoSticker", "autoVn", "viewStory",
    "bcjoin", "getmsg", "nsfw", "antiSpam", "simi", "updateAnime", "updateAnimeNews",
    "viewonce", "welcome", "autoread", "gconly", "nyimak", "pconly", "self", "swonly"
  ];

  const namop = idop.map(id => id.charAt(0).toUpperCase() + id.slice(1)).map(name => name.split(/(?=[A-Z])/).join(' '));
  const desop = idop.map(id => `Mengaktifkan atau menonaktifkan fitur *${id.toUpperCase()}*`);

  if (args[0] && args[0].toLowerCase() === 'list') {
    const teks = idop.map((id, i) => {
      const status = global.db.data.chats[m.chat][id] ? "✅ Sudah aktif" : "❌ Belum aktif";
      return `*${i + 1}.* ${namop[i]}\n${desop[i]}\nStatus: ${status}`;
    }).join("\n\n");

    const { key } = await conn.reply(m.chat, `🔧 Daftar Opsi:\n\n${teks}\n\nBalas pesan ini dengan nomor fitur yang ingin diaktifkan atau dinonaktifkan.`, m);
    optionsData[m.chat] = { idop, key, timeout: setTimeout(() => { /*conn.sendMessage(m.chat, { delete: key }); delete optionsData[m.chat];*/ }, 60 * 1000), pesan: conn };
  } else {
    const { key } = await conn.reply(m.chat, `Gunakan *${usedPrefix}options list* untuk melihat daftar fitur yang bisa diaktifkan dan dinonaktifkan.`, m);
    optionsData[m.chat] = { idop, key, timeout: setTimeout(() => { /*conn.sendMessage(m.chat, { delete: key }); delete optionsData[m.chat];*/ }, 60 * 1000), pesan: conn };
  }
}

handler.before = async m => {
  if (m.isBaileys || !(m.chat in optionsData)) return;

  const { timeout, idop, key, pesan } = optionsData[m.chat];
  if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

  const choice = m.text.trim();
  const numChoice = Number(choice);

  if (isNaN(numChoice) || numChoice < 1 || numChoice > idop.length) {
    await pesan.reply(m.chat, "❗ Pilihan tidak valid.", m);
    return;
  }

  const optionId = idop[numChoice - 1];

  const isEnable = !global.db.data.chats[m.chat][optionId];
  global.db.data.chats[m.chat][optionId] = isEnable;

  const statusText = isEnable ? "✅ diaktifkan" : "❌ dinonaktifkan";

  // Reverse the true/false values for specified options
  const reverseOptions = ["antiDelete", "detect", "getmsg", "lastAnime", "latestNews"];
  if (reverseOptions.includes(optionId)) {
    global.db.data.chats[m.chat][optionId] = !global.db.data.chats[m.chat][optionId];
  }

  await pesan.reply(m.chat, `✨ Fitur *${optionId.toUpperCase()}* telah *${statusText}*.`, m);
};

handler.help = ["options", "setting", "feature"];
handler.tags = ["main"];
handler.command = /^(options|setting|feature)$/i;
handler.limit = true;

export default handler;
