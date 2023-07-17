import fetch from "node-fetch";
let handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    let query = "input text\nEx. .micmonster hello world\n<command> <tex>"
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else throw query
    let urut = text.split`|`
    let one = urut[0]
    let two = urut[1]
    let three = urut[2]
    let res = await generateVoice(one, two, three)
        if (res) await conn.sendMessage(m.chat, {
            audio: res,
            seconds: fsizedoc,
            ptt: true,
            mimetype: "audio/mpeg",
            fileName: "vn.mp3",
            waveform: [100, 0, 100, 0, 100, 0, 100]
        }, {
            quoted: m
        })
}
handler.help = ["micmonster"]
handler.tags = ["misc"]
handler.command = /^(micmonster|micmonsterget|micmonsterlist)$/i
export default handler

async function generateVoice(Locale = "Ardi", Voice = "id-ID-ArdiNeural", Query) {
  const formData = new FormData();
  formData.append("locale", Locale);
  formData.append("content", `<voice name="${Voice}">${Query}</voice>`);
  formData.append("ip", '46.161.194.33');
  const response = await fetch('https://app.micmonster.com/restapi/create', { method: 'POST', body: formData });
  return Buffer.from(('data:audio/mpeg;base64,' + await response.text()).split(',')[1], 'base64');
};