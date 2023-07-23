import yts from "yt-search";

let ytsData = {};

async function handler(m, { conn, args }) {
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

    ytsData[m.chat] = {
        results: results.videos,
        key: key,
        timeout: setTimeout(() => {
            conn.sendMessage(m.chat, { delete: key });
            delete ytsData[m.chat];
        }, 60 * 1000),
        pesan: conn
    };
}

handler.before = async m => {
    if (m.isBaileys || !(m.chat in ytsData)) return;

    let { timeout, results, key, pesan } = ytsData[m.chat];
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

    let choice = m.text.trim();
    let numChoice = Number(choice);

    if (isNaN(numChoice) || numChoice < 1 || numChoice > results.length) {
        await pesan.reply(m.chat, "⚠️ Masukkan nomor video yang valid.", m);
        return;
    }

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

    await pesan.reply(m.chat, teksDetail, m);
    clearTimeout(timeout);

    // Periksa apakah pengguna membalas dengan nomor yang valid untuk mengunduh video
    if (!isNaN(numChoice) && numChoice >= 1 && numChoice <= results.length) {
        let selectedVideo = results[numChoice - 1];
        await pesan.reply(
            m.chat,
            `📥 Unduh video "${selectedVideo.title}": ${selectedVideo.url}`,
            m
        );
    }

    //delete ytsData[m.chat];
};

handler.help = ['yts', 'youtubesearch', 'ytsearch'].map(v => v + ' [kata kunci]');
handler.tags = ['downloader'];
handler.command = /^(yts|youtubesearch|ytsearch)$/i;

export default handler;
