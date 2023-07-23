import similarity from 'similarity';
let susunkalimat = {};

const sentences = {
  easy: [
    "Halo selamat datang",
    "Mari makan bersama",
    "Selamat pagi semuanya",
    "Terima kasih atas bantuanmu",
    "Saya menyukai dirimu",
    "Hujan turun dari langit",
    "Burung terbang dengan indah",
    "Rumah ini sangat kecil",
    "Laut memiliki warna biru yang indah",
    "Bunga di kebun sangat cantik",
  ],
  normal: [
    "Dia mengenakan baju merah",
    "Anjing itu terlihat lucu",
    "Kucing hitam sedang berjalan",
    "Pohon tinggi berdiri kokoh",
    "Mobil besar berwarna merah",
    "Pisang kuning rasanya manis sekali",
    "Sungai mengalir dengan deras",
    "Pantai memiliki pasir putih yang indah",
    "Hutan hijau penuh dengan pepohonan",
    "Gunung tinggi menjulang gagah",
  ],
  hard: [
    "Perpustakaan ini sangat besar dan lengkap",
    "Mobil sport itu bisa mencapai kecepatan tinggi",
    "Taman ini dipenuhi oleh bunga-bunga yang indah",
    "Pulau tersebut memiliki pantai yang indah",
    "Di hutan itu terdapat pohon-pohon yang tinggi",
    "Anjing sedang berlari dengan cepat",
    "Langit malam terhiasi oleh bintang-bintang yang bersinar terang",
    "Burung ini sedang bernyanyi dengan merdu",
    "Rumput hijau yang segar membuat suasana menjadi lebih hidup",
    "Hujan turun dengan deras mengguyur tanah",
  ],
  extreme: [
    "Anak-anak sedang bermain riang di taman bermain",
    "Mobil hitam melaju cepat di jalan tol yang ramai",
    "Bunga-bunga indah mekar di kebun sekolah",
    "Pemandangan alam pegunungan sangat memukau hati",
    "Rumah tua beratap merah berdiri megah di atas bukit",
    "Pantai pasir putih yang eksotis berada di tepi samudra yang biru",
    "Malam hari yang gelap dengan langit penuh bintang berkilauan",
    "Kupu-kupu beterbangan di antara bunga-bunga warna-warni yang menawan",
    "Sungai yang jernih mengalir di tengah hutan tropis yang lebat",
    "Gajah besar berjalan perlahan di padang rumput luas",
  ],
};

async function handler(m, { conn }) {
    if (susunkalimat[m.sender]) {
        return m.reply('Kamu sedang bermain Susun Kalimat!');
    }

    const levels = Object.keys(sentences);
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const randomSentences = sentences[randomLevel];
    const randomIndex = Math.floor(Math.random() * randomSentences.length);

    const originalSentence = randomSentences[randomIndex];
    const shuffledSentence = shuffleSentence(originalSentence);

    m.reply(`🧩 *Level*: ${randomLevel.toUpperCase()}\nSusun kalimat berikut ini menjadi benar:\n\n*${shuffledSentence.toLowerCase()}*\n\nKamu memiliki waktu *60 detik* untuk menjawab.`);

    susunkalimat[m.sender] = {
        sender: m.sender,
        originalSentence,
        shuffledSentence,
        level: randomLevel,
        pesan: conn,
        timeout: setTimeout(() => {
            if (susunkalimat[m.sender]) {
                delete susunkalimat[m.sender];
                m.reply(`⌛ Waktu habis! Kamu gagal menyusun kalimat.\n*${originalSentence.toLowerCase()}*`);
            }
        }, 60000 * 2)
    };
}

handler.before = async (m) => {
    if (m.isBaileys) return;
    if (!(m.sender in susunkalimat)) return;
    if (!m.text) return;

    const { originalSentence, sender, shuffledSentence, pesan } = susunkalimat[m.sender];

    const isAnswerCorrect = m.text.toLowerCase() === originalSentence.toLowerCase();
    const similarityIndex = jaccardSimilarity(m.text.toLowerCase(), originalSentence.toLowerCase());
    const similarityThreshold = 0.8;

    if (isAnswerCorrect) {
        const level = susunkalimat[m.sender].level;
        await pesan.reply(m.chat, `✨ *Selamat*, @${m.sender.split('@')[0]}! Kamu berhasil menyusun kalimat dengan benar pada *level ${level.toUpperCase()}*!`, m, { mentions: [m.sender] });
        clearTimeout(susunkalimat[m.sender].timeout);
        delete susunkalimat[m.sender];
    } else if (similarityIndex >= similarityThreshold) {
        m.reply('Jawaban kamu *hampir benar*! Tapi belum tepat. Coba lagi ya.');
    } else if (m.text.toLowerCase() === 'hint') {
        const hint = originalSentence.replace(/[AIUEOaiueo]/ig, '_')
        m.reply(`🔍 *Clue*: ${hint}`);
    }
};

handler.help = ['susunkalimat'];
handler.tags = ['game'];
handler.command = /^(susunkalimat)$/i;
handler.disabled = false;

export default handler;

function shuffleSentence(sentence) {
    const words = sentence.split(' ').filter(word => word !== ''); // Remove empty words
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    return words.join(' ');
}

function jaccardSimilarity(str1, str2) {
  // Menghitung kesamaan menggunakan Jaccard similarity melalui modul similarity
  const similarityScore = similarity(str1, str2);

  return similarityScore;
}