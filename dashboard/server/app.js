const express = require('express');
const path = require('path'); 
const { doneAnimation } = require('../../logger/index');
const config = require('../../config/config.main.json');
const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});
        
const PORT = config.PORT || 3000;  

const startServer = () => {
    app.listen(PORT, () => {
        doneAnimation(`Server started on port ${PORT}`);
    });
};

module.exports = startServer;