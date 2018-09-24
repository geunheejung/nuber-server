import Twilio from 'twilio';

// twilio Client 생성
const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

/** TODO
 * 1. verification 텍스트 메세지를 전송하는 함수
 * 2. 어떤 메세지든 전송하는 함수
 */

// 어떤 번호로든 어떤 본문과 함께 텍스트 메세지를 보내는 함수
export const sendSMS = (to: string, body: string) => {
  return twilioClient.messages.create({
    body,
    to,
    from: process.env.TWILIO_PHONE,
  });
};

// 정해진 내용을 user에게 보내는 함수
export const sendVerificationSMS = (to: string, key: string) =>
  sendSMS(to, `Your Verification key is: ${key}`);
