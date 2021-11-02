import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import config from '../../config';

const inviteHtml = fs.readFileSync(
  path.join(__dirname, 'templates', 'invite.hbs'),
  { encoding: 'utf-8' },
);

const carnetHtml = fs.readFileSync(
  path.join(__dirname, 'templates', 'carnet.hbs'),
  { encoding: 'utf-8' },
);

const inviteTemplate = Handlebars.compile(inviteHtml);
const carnetTemplate = Handlebars.compile(carnetHtml);

class Mailer {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
  }

  async sendInvite(email: string, token: string) {
    const template = inviteTemplate({
      inviteUrl: token,
    });
    const info = await this.transporter.sendMail({
      from: `Fabian de la liga vallecaucana <${config.emailUser}>`,
      to: email,
      subject: 'Invitación de registro',
      text: `http://localhost:4000/signup?token=${token}`,
      html: template,
    });
    return info;
  }

  async sendFile(email: string, file: Buffer, extraInfo?: { firstName: string, lastName: string }) {
    const template = carnetTemplate({
      firstName: extraInfo?.firstName.toUpperCase(),
      lastName: extraInfo?.lastName.toUpperCase(),
    });
    const info = await this.transporter.sendMail({
      from: `Fabian de la Liga Vallecaucana <${config.emailUser}>`,
      to: email,
      subject: 'Carnet Liga Vallecaucana de Baloncesto',
      text: 'Adjuntamos el carnet de registro de la liga vallecaucana de baloncesto',
      html: template,
      attachments: [
        {
          filename: 'carnet.jpeg',
          content: file,
        },
      ],
    });
    return info;
  }
}

export default Mailer;
