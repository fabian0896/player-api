import sgMail from '@sendgrid/mail';
import config from '../config';

sgMail.setApiKey(config.sendgridApiKey);

const msg: sgMail.MailDataRequired = {
  to: 'ventas@fajasinternacionales.com',
  from: config.sendgridEmail,
  subject: 'Invitación liga vallecaucana de baloncesto',
  templateId: 'd-689336e5a36c42919e67f309082f9312',
  dynamicTemplateData: {
    link: 'https://facebook.com',
  },
};

const sendGridEmail = async () => {
  try {
    await sgMail.send(msg);
    console.log('se envio el correo');
  } catch (error) {
    console.log(error);
  }
};

export default sendGridEmail;
