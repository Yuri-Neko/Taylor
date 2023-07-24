import yts from "yt-search";

async function handler(m, { conn, args }) {
conn.ytsData = conn.ytsData ? conn.ytsData : {};

    let query = args.join(" ");
    if (!query) {
        return conn.reply(m.chat, "⚠️ Masukkan kata kunci untuk mencari video di YouTube.", m);
    }

    let results = await yts(query);
    if (!results || results.videos.length === 0) {
        return conn.reply(m.chat, "❌ Tidak ditemukan hasil pencarian.", m);
    }

    let teks = results.videos
        .map((v, i) => `*${i + 1}.* ${v.title}`)
        .join("\n");

    let { key } = await conn.reply(
        m.chat,
        `🔎 Hasil Pencarian untuk "${query}":\n\n${teks}\n\nBalas pesan ini dengan nomor video yang ingin Anda lihat detailnya.`,
        m
    );

    conn.ytsData[m.chat] = {
        results: results.videos,
        key: key,
        timeout: setTimeout(() => {
            conn.sendMessage(m.chat, { delete: key });
            delete conn.ytsData[m.chat];
        }, 60 * 1000)
    };
}

handler.before = async (m, { conn }) => {
conn.ytsData = conn.ytsData ? conn.ytsData : {};
    if (m.isBaileys || !(m.chat in conn.ytsData)) return;

    let { timeout, results, key } = conn.ytsData[m.chat];
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

    let choice = m.text.trim();
    let numChoice = Number(choice);

    if (isNaN(numChoice) || numChoice < 1 || numChoice > results.length) {
    await conn.reply(m.chat, "⚠️ Masukkan nomor video yang valid.", m);
  } else {
    let video = results[numChoice - 1];
    let teksDetail = `
📹 *Detail Video*
📺 Judul: ${video.title}
👀 Views: ${video.views}
⏱️ Durasi: ${video.timestamp}
⌚ Diunggah Oleh: ${video.author.name}
🔗 Link: ${video.url}
📝 Deskripsi: ${video.description}
🖼️ Gambar: ${video.image}
🖼️ Thumbnail: ${video.thumbnail}
⏰ Waktu: ${video.timestamp}
⏲️ Durasi Timestamp: ${video.duration.timestamp}
⌛ Durasi Detik: ${video.duration.seconds}
👤 Nama Penulis: ${video.author.name}
🔗 URL Penulis: ${video.author.url}
`.trim();

    await conn.reply(m.chat, teksDetail, m);
    clearTimeout(timeout);

    // Periksa apakah pengguna membalas dengan nomor yang valid untuk mengunduh video
    if (!isNaN(numChoice) && numChoice >= 1 && numChoice <= results.length) {
        let selectedVideo = results[numChoice - 1];
        await conn.reply(
            m.chat,
            `📥 Unduh video "${selectedVideo.title}": ${selectedVideo.url}`,
            m
        );
    }

    //delete conn.ytsData[m.chat];
    }
};

handler.help = ['yts', 'youtubesearch', 'ytsearch'].map(v => v + ' [kata kunci]');
handler.tags = ['downloader'];
handler.command = /^(yts|youtubesearch|ytsearch)$/i;

export default handler;
