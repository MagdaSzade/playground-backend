const { info } = require('winston');
const config = require('config');
const nodemailer = require('nodemailer');
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

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: config.get("email"), 
        ClientID: config.get("CLIENT_ID"),
        clientSecret: config.get("SECRET"),
        refreshToken: config.get("REFRESH_TOKEN"),
        accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = async function sendEmail(req, res) {
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
            } catch (err) {
                error(err.message, err);
                res.status(500).send();
            }
        transporter.close();
        res.status(200).send();
    } else {
        res.status(400).send();
    }   
}