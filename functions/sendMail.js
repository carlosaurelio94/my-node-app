const nodemailer = require('nodemailer');
const { Client } = require('pg');

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

// Configuración de la conexión a PostgreSQL
const client = new Client({
    host: process.env.POSTGRES_HOST || 'postgres',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
});

console.log('Connecting to PostgreSQL with:', {
    host: process.env.POSTGRES_HOST || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE
});

// Intentar conectar a la base de datos PostgreSQL
client.connect((err) => {
    if (err) {
        console.error('Error connecting to the database, retrying...', err);
        return;
    } else {
        console.log('Connected to the PostgreSQL database.');
    }
});

console.log(`Attempting to connect to PostgreSQL at host: ${process.env.POSTGRES_HOST || 'postgres'}, user: ${process.env.POSTGRES_USER}, database: ${process.env.POSTGRES_DATABASE}`);

function sendMail(mailContent) {
    // Verifica si la conexión sigue activa
    client.query('SELECT 1', (err) => {
        if (err) {
            console.error('Error pinging the database:', err);
        } else {
            console.log('Database connection active.');
        }
    });

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

        // Query adaptada para PostgreSQL
        const query = `
            INSERT INTO emails_sent (email_to, email_from, sent_date) 
            VALUES ($1, $2, NOW())
        `;

        client.query(query, [mailContent.to, mailOptions.from], (err, result) => {
            if (err) {
                console.error('Error inserting data into the PostgreSQL database:', err.stack);
            } else {
                console.log('Email record added to the PostgreSQL database');
            }
        });
    });
}

module.exports = sendMail;



/*const nodemailer = require('nodemailer');
const postgres = require('pg');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

console.log('Connecting to MySQL with:', {
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database, retrying...', err);
        return;
    } else {
        console.log('Connected to the database.');
    }
});

console.log(`Attempting to connect to MySQL at host: ${process.env.MYSQL_HOST || 'mysql'}, user: ${process.env.MYSQL_USER}, database: ${process.env.MYSQL_DATABASE}`);

function sendMail(mailContent) {
    connection.ping((err) => { console.log(err) });

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

        connection.query(query, [mailContent.to, mailOptions.from], (err, result) => {
            if (err) {
                console.error('Error inserting data into the database:', err.stack);
            } else {
                console.log('Email record added to the database');
            }
        });
    });
}


module.exports = sendMail*/
