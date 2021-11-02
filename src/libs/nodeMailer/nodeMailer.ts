import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const inviteHtml = fs.readFileSync(
  path.join(__dirname, 'templates', 'invite.hbs'),
  { encoding: 'utf-8' },
);
const inviteTemplate = Handlebars.compile(inviteHtml);

class Mailer {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'fabianddg0896@gmail.com',
        pass: 'cqlqjlukpvnnmsbu',
      },
    });
  }

  async sendInvite(email: string, token: string) {
    const template = inviteTemplate({
      inviteUrl: token,
    });
    const info = await this.transporter.sendMail({
      from: 'Fabian de la liga vallecaucana <fabianddg0896@gmail.com>',
      to: email,
      subject: 'Invitación de registro',
      text: `http://localhost:4000/signup?token=${token}`,
      html: template,
    });
    return info;
  }

  async sendFile(email: string, file: Buffer) {
    const info = await this.transporter.sendMail({
      from: 'Fabian de la liga vallecaucana <fabianddg0896@gmail.com>',
      to: email,
      subject: 'Carnet liga vallecaucana de baloncesto',
      text: 'Adjuntamos el carnet de registro de la liga vallecaucana de baloncesto',
      html: '<p>Some text here</p>',
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
