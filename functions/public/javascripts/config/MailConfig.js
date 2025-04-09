const nodeMail = require('nodemailer');

const transporter = nodeMail.createTransport({
    service: 'gmail',
    auth: {
        user: 'mentormeid1@gmail.com',
        pass: 'kbbi eiva fzxw twsn',
    },
});

async function sendEmail(to, subject, text){
    try {
        const mailOptions = {
            from: 'mentormeid1@gmail.com',
            to: to,
            subject: subject,
            text: text,
        };

        // Mengirim email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }
            return "Successfully sent!";
        });
    }catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
}

module.exports = {
    sendEmail,
}