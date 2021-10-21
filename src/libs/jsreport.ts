import axios from 'axios';
import { Player } from '@prisma/client';

import config from '../config';

const API = config.reportApi;
const TEMPLATE_ID = 'fepBHhGC77';

const username = config.reportUser;
const password = config.reportPassword;

const generateReport = async (user: Player) => {
  const { data } = await axios.post<Buffer>(
    API,
    {
      template: { shortid: TEMPLATE_ID },
      data: user,
    },
    {
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    },
  );
  return data;
};

export default generateReport;
