import Joi from 'joi';

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();
const name = Joi.string();
const role = Joi.string().valid('admin', 'reader', 'editor');
const active = Joi.boolean();
const inviteToken = Joi.string();

export const getUserSchema = Joi.object({
  id: id.required(),
});

export const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  name: name.required(),
  role: role.required(),
  active,
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
  name,
  role,
  active,
});
