import { Prisma, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../libs/prisma';
import config from '../config';

class AuthService {
  static async createUser(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }

  static async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  static async signTokens(user: User) {
    const payload = {
      name: user.name,
      email: user.email,
      sub: user.id,
      scope: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const refreshToken = jwt.sign({ sub: user.id }, config.jwtRefreshSecret, { expiresIn: '30d' });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });
    return {
      token,
      refreshToken,
      expireIn: 15 * 60 * 1000,
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
        role: user.role,
      },
    };
  }

  static async logout(id: number) {
    await prisma.user.update({
      where: { id },
      data: { refreshToken: '' },
    });
  }
}

export default AuthService;
