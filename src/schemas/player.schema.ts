import Joi from 'joi';

const id = Joi.number().integer();
const firstName = Joi.string();
const lastName = Joi.string();
const birthday = Joi.date();
const eps = Joi.string();
const email = Joi.string().email();
const picture = Joi.string().uri();
const cedula = Joi.string();
const phone = Joi.string();
const active = Joi.boolean();

const cursor = Joi.number().integer().positive();
const size = Joi.number().integer().positive();
const query = Joi.string();

export const createPlayerSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  birthday: birthday.required(),
  eps: eps.required(),
  email: email.required(),
  cedula: cedula.required(),
  phone: phone.required(),
  picture,
  active,
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
  active,
});

export const getPlayerSchema = Joi.object({
  id: id.required(),
});

export const getPlayerPaginationSchema = Joi.object({
  cursor,
  size,
  query,
});
