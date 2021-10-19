import Joi from 'joi';

const id = Joi.number().integer();
const firstName = Joi.string();
const lastName = Joi.string();
const birthday = Joi.date();
const eps = Joi.string();
const email = Joi.string().email();
const picture = Joi.string().uri();

export const createPlayerSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  birthday: birthday.required(),
  eps: eps.required(),
  email: email.required(),
  picture,
});

export const updatePlayerSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  birthday: birthday.required(),
  eps: eps.required(),
  email: email.required(),
  picture,
});

export const getPlayerSchema = Joi.object({
  id: id.required(),
});
