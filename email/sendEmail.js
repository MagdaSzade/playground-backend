const { info, error } = require('winston');
const config = require('config');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    config.get("CLIENT_ID"),
    config.get("SECRET"),
    config.get("redirect")
);

oauth2Client.setCredentials({
    refresh_token: config.get("REFRESH_TOKEN")
});


module.exports = async function sendEmail(req, res) {
    const { token } = await oauth2Client.getAccessToken();
    console.log(config.get("CLIENT_ID"));
    console.log(config.get("SECRET"));
    console.log(config.get("redirect"));
    console.log(token);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: config.get("email"),
            ClientID: config.get("CLIENT_ID"),
            clientSecret: config.get("SECRET"),
            refreshToken: config.get("REFRESH_TOKEN"),
            accessToken: token
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    if (req.body.email && req.body.message && req.body.title) { 
        const newMessage = { email: req.body.email,
                            title: req.body.title,
                            message: req.body.message };
        info(newMessage);
        try {
            await transporter.sendMail({
                from: config.get('email'),
                to: config.get('myEmail'),
                cc: newMessage.email,
                subject: newMessage.title,
                text: newMessage.message });
                transporter.close();
        } catch (err) {
            error(err.message);
            res.status(500).send();
        }
        res.status(200).send();
    } else {
        res.status(400).send();
    }   
}