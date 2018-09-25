import Mailgun from 'mailgun-js';

const mainGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || '',
});

const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: 'geuni1013@gmail.com',
    to: 'geuni1013@gmail.com', // to는 유료여야 아무나 가능
    subject,
    html,
  };
  return mainGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verfiy your email`;
  const emailBody = `Verfiy your email by clicking <a href="http://nuber.com/verification/${key}/">here<a/>`;
  return sendEmail(emailSubject, emailBody);
};
