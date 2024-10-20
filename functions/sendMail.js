const nodemailer = require('nodemailer');
const mysql = require('mysql2');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});


function sendMail(mailContent, userId) {
    const mailOptions = {
        from: 'notificacionesautomaticas2024@gmail.com',
        to: mailContent.to,
        subject: mailContent.subject,
        text: mailContent.text
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        const query = `
            INSERT INTO emails_sent (email_to, email_from, sent_date) 
            VALUES (?, ?, NOW())
        `;
        console.log(query)
        connection.query(query, [mailContent.to, mailOptions.from], (err, result) => {
            if (err) {
                console.error('Error inserting data into the database:', err.stack);
            } else {
                console.log('Email record added to the database');
            }
        });
    });
}


module.exports = sendMail