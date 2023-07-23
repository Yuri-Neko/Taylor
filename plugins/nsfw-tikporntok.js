import cheerio from 'cheerio';
import fetch from 'node-fetch';

let optionsData = {};

const getTikPornData = async () => {
  try {
    const response = await fetch('https://tikporntok.com/?random=1');
    const htmlText = await response.text();
    const $ = cheerio.load(htmlText);

    const hasil = [];
    $('.swiper-slide').each(function (index, element) {
      const title = $(element).attr('data-title');
      const video = $(element).find('source').attr('src') || $(element).find('video').attr('src');
      const thumb = $(element).find('img').attr('src');
      const desc = $(element).find('.shorts_events > p').text().trim();
      const views = $(element).find('#video-views-count-' + index).text();

      hasil.push({
        title,
        video,
        thumb,
        desc,
        views,
      });
    });

    return hasil;
  } catch (error) {
    throw new Error('Error fetching data from TikPornTok: ' + error.message);
  }
};

const getCaption = (obj) => `
📝 *Title:* ${obj.title}
🔗 *Link:* ${obj.video}
📢 *Description:* ${obj.desc}
👀 *Views Count:* ${obj.views}
`;

const handler = async (m, { conn }) => {
  const list = await getTikPornData();
  const teks = list.map((obj, index) => `*${index + 1}.* ${obj.title}`).join('\n');
  const { key } = await conn.reply(m.chat, `🔧 Daftar Video TikPorn:\n\n${teks}\n\nBalas pesan ini dengan nomor video yang ingin ditampilkan.`, m);
  optionsData[m.chat] = { list, key, timeout: setTimeout(() => { conn.sendMessage(m.chat, { delete: key }); /*delete optionsData[m.chat];*/ }, 60 * 1000), pesan: conn };
};

handler.before = async m => {
  if (!optionsData[m.chat]) return;
  const { list, key, pesan } = optionsData[m.chat];
  const index = parseInt(m.text.trim());

  if (m.isBaileys || isNaN(index) || index < 1 || index > list.length) return;
  
  const selectedObj = list[index - 1];
  await pesan.sendFile(m.chat, selectedObj.video, '', getCaption(selectedObj), m);
  clearTimeout(optionsData[m.chat].timeout);
  //delete optionsData[m.chat];
};

handler.help = ["tikporn", "tikporntok", "tiktokporn"];
handler.tags = ["search"];
handler.command = /^(tikporn|tikporntok|tiktokporn)$/i;
handler.limit = true;

export default handler;
