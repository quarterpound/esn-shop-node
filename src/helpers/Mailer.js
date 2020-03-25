const nodemailer = require("nodemailer");

class Mailer {
    constructor (username, password) {
        this.transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {
                user: username,
                pass: password,
            },
        })
    }

    sendMail = async (to, email) => {
        let info
        try {
            info = await this.transporter.sendMail({
                from: `"ESN Shop" <shop@esn.az>`,
                to: to,
                subject: email.subject,
                html: email.html,
            })
        } catch (e) {
            console.log(e);
        }

        return info;
    }
}

module.exports = Mailer