import { MailtrapClient } from "mailtrap";
import { mailtrap } from "./mailtrap";

interface AttachmentProps {
  filename: string;
  path?: string;
  cid: string;
}

export const sendEmail = (to: string, from: string, subject: string, html: string, attachments?: AttachmentProps[]) => {
  mailtrap.sendMail({
    to,
    subject,
    from,
    html: html,
    attachments: attachments,
  });
};

const TOKEN = "33248debbde7bafa1fe327a2440f0107";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@bookwave.online",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "vladimir.ciuculescu@gmail.com",
  },
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
