import Joi from 'joi';

const email = Joi.string().email();
const password = Joi.string();
const name = Joi.string();
const role = Joi.string().valid('admin', 'reader', 'editor');
const inviteToken = Joi.string();

export const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  name: name.required(),
  role: role.required(),
});

export const inviteUserSchema = Joi.object({
  role: role.required(),
  email: email.required(),
});

export const signupSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  inviteToken: inviteToken.required(),
});

export const updateUserSchema = Joi.object({
  email,
  password,
  name,
  role,
});
