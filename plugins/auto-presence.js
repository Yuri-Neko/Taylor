export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys) return false;
  let chat = global.db.data.chats[m.chat] || { autoPresence: false }
  if (chat.autoPresence) {
    const data = global.plugins;
    const datas = Object.values(data).map(({ tags, command }) => ({ tags, command }));
    const q = removeFirstLetter(m.text);
    for (const item of datas) {
      if (item.tags && item.command !== undefined) {
        const text = q.trim().toLowerCase();
        if (item.command instanceof RegExp) {
          if (item.command.test(text)) {
            this.sendPresenceUpdate('composing', m.chat)
          } else {
          this.sendPresenceUpdate('available', m.chat)
          }
        } else if (Array.isArray(item.command)) {
          for (const cmd of item.command) {
            const regex = new RegExp('^' + cmd + '$', 'i');
            if (regex.test(text)) {
              this.sendPresenceUpdate('composing', m.chat)
            } else {
          this.sendPresenceUpdate('available', m.chat)
          }
          }
        }
      }
    }
  }
}

function removeFirstLetter(word) {
  if (typeof word !== 'string' || word.length === 0) {
    return ""; // Return an empty string if the input is not a non-empty string
  }

  return word.substring(1); // Return the substring starting from index 1 (omitting the first letter)
}
