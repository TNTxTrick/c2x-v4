const axios = require("axios");
require("colors");

module.exports = {
    name: "sharefb",
    alias: ['json'],
    author: "Nguyên Blue",
    category: "SYSTEMS",
    version: "1.0",
    nopre: false,
    admin: true,
    wait: 3,
    desc: "Chia sẻ bài viết lên Facebook bằng ID và Cookie",
    async onCall({ message, args }) {
        if (args.length < 2) {
            return message.reply("Vui lòng nhập cookie và ID bài viết! Ví dụ: sharefb <cookie> <id>");
        }

        const cookie = args[0]; // Cookie từ args
        const postId = args[1]; // ID bài viết từ args

        const headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': "Windows",
            'cookie': cookie
        };

        const getToken = async () => {
            try {
                const res = await axios.get('https://business.facebook.com/content_management', { headers });
                const token = res.data.match(/EAAG[A-Za-z0-9]+/)[0];
                return token;
            } catch (error) {
                console.error("[ ERROR ]: Lỗi khi lấy token!".brightRed, error.message);
                throw new Error("Không thể lấy token. Kiểm tra lại cookie!");
            }
        };

        const sharePost = async (token, postId) => {
            try {
                const shareHeaders = {
                    ...headers,
                    'host': 'graph.facebook.com',
                    'accept-encoding': 'gzip, deflate'
                };

                const shareURL = `https://graph.facebook.com/me/feed?link=https://m.facebook.com/${postId}&published=0&access_token=${token}`;
                const res = await axios.post(shareURL, {}, { headers: shareHeaders });

                console.log('[ SUCCESS ]: Đã chia sẻ bài viết với ID: '.brightWhite + `${res.data.id}`.brightGreen);
                message.reply(`Chia sẻ thành công bài viết với ID: ${res.data.id}`);
            } catch (error) {
                console.error("[ ERROR ]: Không thể chia sẻ bài viết!".brightRed, error.message);
                message.reply("Chia sẻ thất bại! Kiểm tra lại token hoặc ID bài viết.");
            }
        };

        try {
            message.reply("Đang lấy token và chia sẻ bài viết...");
            const token = await getToken();
            await sharePost(token, postId);
        } catch (error) {
            message.reply(error.message);
        }
    }
};
