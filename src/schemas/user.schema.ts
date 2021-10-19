import Joi from 'joi';

const email = Joi.string().email();
const password = Joi.string();
const name = Joi.string();
const role = Joi.string().valid('admin', 'reader', 'editor');

export const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  name: name.required(),
  role: role.required(),
});

export const updateUserSchema = Joi.object({
  email,
  password,
  name,
  role,
});
