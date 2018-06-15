nodemailer = require('nodemailer'),

exports.send_mail = async (obj) => {

    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mailfortest32018@gmail.com',
            pass: 'TrinhVM@1'
        }
    });

    await console.log("email " + obj.mail);

    let mailOptions = await {
        from: 'mailfortest32018@gmail.com',
        to: obj.mail,
        subject: obj.subject,
        text: obj.text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return false
        } else {
            return true
        }
    });
};
