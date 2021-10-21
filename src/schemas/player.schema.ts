import Joi from 'joi';

const id = Joi.number().integer();
const firstName = Joi.string();
const lastName = Joi.string();
const birthday = Joi.date();
const eps = Joi.string();
const email = Joi.string().email();
const picture = Joi.string().uri();
const cedula = Joi.number().integer();
const phone = Joi.string();

const page = Joi.number().integer().positive().min(1);
const size = Joi.number()
  .integer()
  .positive()
  .min(1)
  .max(100);

export const createPlayerSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  birthday: birthday.required(),
  eps: eps.required(),
  email: email.required(),
  cedula: cedula.required(),
  phone: phone.required(),
  picture,
});

export const updatePlayerSchema = Joi.object({
  firstName,
  lastName,
  birthday,
  eps,
  email,
  cedula,
  picture,
  phone,
});

export const getPlayerSchema = Joi.object({
  id: id.required(),
});

export const getPlayerPaginationSchema = Joi.object({
  page,
  size,
});
