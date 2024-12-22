module.exports = {
    name: "spam",
    author: "",
    category: "SYSTEMS",
    version: "1.0",
    nopre: false,
    admin: false,
    wait: 3,
    desc: "spam sms.",
    async onCall({ message, args, user }) {
        try {
