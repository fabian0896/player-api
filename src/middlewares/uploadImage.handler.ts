import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

const uploadHandler = (fieldName: string) => upload.single(fieldName);

export default uploadHandler;
