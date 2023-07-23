let storyData = {};

const handler = async (m, { conn }) => {
    const list = conn.story || [];
    if (list.length === 0) {
        return await conn.reply(m.chat, `Tidak ada cerita yang tersedia saat ini. Silakan tambahkan cerita dengan mengirim gambar, video, atau pesan suara.`, m, { mentions: [m.sender] });
    }

    const teks = list.map((obj, index) => {
        let text = `*${index + 1}.* @${obj.sender.split('@')[0]}`;
        if (obj.caption) text += `\n_${obj.caption}_`;
        return text;
    }).join('\n');
    let { key } = await conn.reply(
        m.chat,
        `🔧 Daftar Cerita:\n\n${teks}\n\nBalas pesan ini dengan nomor cerita yang ingin ditampilkan.`,
        m,
        { mentions: [m.sender] }
    );
    storyData[m.chat] = { list, key, timeout: setTimeout(() => { delete storyData[m.chat]; }, 60 * 1000), pesan: conn };
};

handler.before = async m => {
    if (!storyData[m.chat]) return;
    const { list, key, pesan } = storyData[m.chat];
    const index = parseInt(m.text.trim());

    if (m.isBaileys || isNaN(index) || index < 1 || index > list.length) return;

    const selectedObj = list[index - 1];
    if (selectedObj.type === 'imageMessage' || selectedObj.type === 'videoMessage') {
        const caption = selectedObj.caption ? selectedObj.caption : '';
        await pesan.sendFile(m.chat, selectedObj.buffer, '', caption, m, false, { mentions: [m.sender] });
    } else if (selectedObj.type === 'audioMessage') {
        await pesan.sendFile(m.chat, selectedObj.buffer, '', '', m);
    } else if (selectedObj.type === 'extendedTextMessage') {
        const message = selectedObj.message ? selectedObj.message : '';
        await pesan.reply(m.chat, message, m, { mentions: [m.sender] });
    }
};

handler.help = ["botsw", "listsw"];
handler.tags = ["search"];
handler.command = /^(botsw|listsw)$/i;
handler.limit = true;

export default handler;