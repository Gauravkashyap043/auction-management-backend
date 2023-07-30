import twilio from 'twilio';

const accountSid = 'AC2c16d956ea6563694e2a134fba06da2d';
const authToken = 'd2d996944ea45b3085712acd6ff99cb9';
const client = twilio(accountSid, authToken);

export function sendSMS(to: string, message: string): void {
  client.messages
    .create({
      body: message,
      from: '+919625865092',
      to: to,
    })
    .then((message) => console.log('SMS sent:', message.sid))
    .catch((error) => console.error('Error sending SMS', error));
}
