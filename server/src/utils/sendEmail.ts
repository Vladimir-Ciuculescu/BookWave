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
