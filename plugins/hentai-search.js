import cheerio from 'cheerio';
import fetch from 'node-fetch';

let optionsData = {};

const getHentaiList = async () => {
  const page = Math.floor(Math.random() * 1153);
  const response = await fetch(`https://sfmcompile.club/page/${page}`);
  const htmlText = await response.text();
  const $ = cheerio.load(htmlText);

  const hasil = [];
  $('#primary > div > div > ul > li > article').each(function (a, b) {
    hasil.push({
      title: $(b).find('header > h2').text(),
      link: $(b).find('header > h2 > a').attr('href'),
      category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
      share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
      views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
      type: $(b).find('source').attr('type') || 'image/jpeg',
      video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
      video_2: $(b).find('video > a').attr('href') || ''
    });
  });

  return hasil;
};

const getCaption = (obj) => `
📝 *Title:* ${obj.title}
🔗 *Link:* ${obj.link}
🏷️ *Category:* ${obj.category}
📢 *Share Count:* ${obj.share_count}
👀 *Views Count:* ${obj.views_count}
🎞️ *Type:* ${obj.type}
`;

const handler = async (m, { conn }) => {
  const list = await getHentaiList();
  const teks = list.map((obj, index) => `*${index + 1}.* ${obj.title}`).join('\n');
  let { key } = await conn.reply(m.chat, `🔧 Daftar Hasil:\n\n${teks}\n\nBalas pesan ini dengan nomor video yang ingin ditampilkan.`, m);
  optionsData[m.chat] = { list, key, timeout: setTimeout(() => { /*conn.sendMessage(m.chat, { delete: key }); delete optionsData[m.chat];*/ }, 60 * 1000), pesan: conn };
};

handler.before = async m => {
  if (!optionsData[m.chat]) return;
  const { list, key, pesan } = optionsData[m.chat];
  const index = parseInt(m.text.trim());

  if (m.isBaileys || isNaN(index) || index < 1 || index > list.length) return;
  
  const selectedObj = list[index - 1];
  await pesan.sendFile(m.chat, selectedObj.video_1, '', getCaption(selectedObj), m);
  //await pesan.sendMessage(m.chat, { delete: key });
  //clearTimeout(optionsData[m.chat].timeout);
  //delete optionsData[m.chat];
};

handler.help = ["hentaivid", "hentaimp4", "hentaivideo"];
handler.tags = ["search"];
handler.command = /^(hentaivid|hentaimp4|hentaivideo)$/i;
handler.limit = true;

export default handler;
