// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;
const cron = require('node-cron');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

const sendMail = require('./functions/sendMail');

let mailContent = {
    to: '',
    subject: 'Notification',
    text: "It's time to do something different"
}

cron.schedule('0 10 * * *', () => {
    sendMail(mailContent)
});

app.get('/send', (req, res) => {
    mailContent.to = req.body.emailTo
    sendMail(mailContent)
    res.send('¡Hola, Docker!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});