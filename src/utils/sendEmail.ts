import Mailgun from 'mailgun-js';

const mainGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || '',
});
