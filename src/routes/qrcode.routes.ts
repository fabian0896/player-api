import express from 'express';
import Qrcode from 'qrcode';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.type('png');
  await Qrcode.toFileStream(res, id, { width: 500, margin: 2 });
});

export default router;
