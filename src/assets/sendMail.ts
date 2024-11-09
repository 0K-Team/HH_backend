import { EmailClient } from "@azure/communication-email";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING || "";
const client = new EmailClient(connectionString);

const sendMail = async (subject: string, html: string, respipient: string) => {
    const emailMessage = {
        senderAddress: "no-reply@ecomail.q1000q.me",
        content: {
            subject: subject,
            html: html,
        },
        recipients: {
            to: [{ address: respipient }],
        },
        
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();

    return(result);
}

export default sendMail;