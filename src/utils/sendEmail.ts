import Mailgun from 'mailgun-js';

const mainGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: 'sandbox2147fde3ed174ddc9ebb4d6bf85f0292.mailgun.org',
});

const sendEmail = (subject: string, html: string) => {
  console.log('sendEmail', subject, html);
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
  console.log('sendVerificationEmail', fullName, key);
  return sendEmail(emailSubject, emailBody);
};
