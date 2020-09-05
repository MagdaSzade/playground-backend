const { info } = require('winston');
const nodemailer = require('nodemailer');
const config = require('config');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.get('email'),
      pass: config.get('password')
    }
});

module.exports = function sendEmail(req, res) {
    if (req.body.email && req.body.message && req.body.title) { 
        const newMessage = { email: req.body.email,
                            title: req.body.title,
                            message: req.body.message };
        info(newMessage);
        try {
            transporter.sendMail({
                from: config.get('email'),
                to: config.get('myEmail'),
                cc: newMessage.email,
                subject: newMessage.title,
                text: newMessage.message });
            } catch (err) {
                error(err.message, err);
                res.status(500).send();
            }
        res.status(200).send();
    } else {
        res.status(400).send();
    }   
}