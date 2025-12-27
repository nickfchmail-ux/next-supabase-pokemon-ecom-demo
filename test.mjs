import { Resend } from 'resend';

const resend = new Resend('re_UPiVcfbt_GaXA4b4ezeLoGC6D2LvcB6P6');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'nickfchmail@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
});

console.log('done!');
