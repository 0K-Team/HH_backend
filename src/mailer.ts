import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST as string,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER as string,
        pass: process.env.MAIL_PASS as string
    }
});

const templates = {
    accountRegistration: handlebars.compile(fs.readFileSync("src/templates/accountRegistration.hbs", "utf-8")),
    accountDeleteConfirm: handlebars.compile(fs.readFileSync("src/templates/accountDeleteConfirm.hbs", "utf-8"))
}

const sendMail = (reciever: string, body: string, subject: string) => {
    transporter.sendMail({
        from: process.env.MAIL_USER as string,
        to: reciever,
        subject,
        html: body
    }, (error, info) => {
        if (error) return console.log(error), error;

        console.log("Email sent: " + info.response);
    })
}

export const sendAccountRegistration = (reciever: string, username: string) => {
    return sendMail(reciever, templates.accountRegistration({ username }), "Account Registration");
}