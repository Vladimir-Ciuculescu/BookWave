import { mailtrap } from "./mailtrap";

export const sendEmail = (to: string, from: string, html: string) => {
  mailtrap.sendMail({
    to,
    from,
    html: html,
  });
};
