import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import Qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { Player, Image } from '.prisma/client';

const phone = puppeteer.devices['iPhone 8 Plus'];

const content = fs.readFileSync(
  path.join(__dirname, 'templates', 'image.hbs'),
  { encoding: 'utf-8' },
);
const template = Handlebars.compile(content);

const cardRender = async (player: Player & {images: Image | null}) => {
  // ejecuto el template con los datos del player
  const {
    id,
    firstName,
    lastName,
    eps,
    cedula,
    images,
  } = player;

  // Genero el codigo qr del usuario.
  const qrImage = await Qrcode.toDataURL(String(id), { width: 500, margin: 2 });

  const html = template({
    id,
    firstName,
    lastName,
    eps,
    cedula,
    qrImage,
    profileImage: images?.large,
  });

  // inicio el navegador
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  // creo una pagina y emulo un iphone 8 plus
  const page = await browser.newPage();
  await page.emulate(phone);

  // cargo mi contenido renderizado por handlebars en la pagina
  await page.setContent(html, { waitUntil: 'load' });

  // tomo screenshoot y lo guardo en jpeg calidad 100
  const imageResult = await page.screenshot({ type: 'jpeg', quality: 100 });

  // cierro el navegador
  await browser.close();

  return imageResult as Buffer;
};

export default cardRender;
