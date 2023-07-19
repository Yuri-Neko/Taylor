export async function all(m) {
    if (!m.isBaileys && !m.fromMe) return; // Jika m.isBaileys dan m.fromMe bernilai true, langsung keluar dari fungsi
    const chat = global.db.data.chats[m.chat]
    if (chat.antiSpam) {
        const pengirim = m.sender; // Ganti dengan pengirim yang sesuai
        const user = global.db.data.users[pengirim]
        const currentTime = Date.now();
        this.spam = this.spam || {};

        /*
            if (user && user.banned) {
                this.reply(m.chat, "⚠️ Kamu sudah dibanned dan tidak bisa memakai bot.", m, {
                    mentions: [pengirim]
                });
                return; // Jika pengguna sudah dibanned, hentikan eksekusi kode selanjutnya.
            }
        */

        if (!this.spam[pengirim]) {
            this.spam[pengirim] = {
                count: 1,
                lastSentTime: currentTime
            };
        } else {
            const {
                count,
                lastSentTime
            } = this.spam[pengirim];
            if (count >= 3 && currentTime - lastSentTime < 3000) {
                const warn = (user && user.warn) || 0;
                if (warn < 5) {
                    user = user || {};
                    user.warn = (user.warn || 0) + 1;
                    const remainingWarn = 5 - warn - 1;
                    this.reply(m.chat, `👋 Hai, @${pengirim.split("@")[0]} Jangan spam!\nWarn: ${warn + 1}/5. Sisa peringatan: ${remainingWarn}`, m, {
                        mentions: [pengirim]
                    });
                } else if (warn === 5) {
                    user.banned = true;
                    user.warn = 0;
                    this.reply(m.chat, "⚠️ Kamu sudah dibanned karena mendapatkan 5 warn", m, {
                        mentions: [pengirim]
                    });
                }
                this.spam[pengirim] = {
                    count: 1,
                    lastSentTime: currentTime
                };
            } else {
                this.spam[pengirim] = {
                    count: count + 1,
                    lastSentTime: currentTime
                };
            }
        }
    }
}