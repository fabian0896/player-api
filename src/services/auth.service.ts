import { Prisma, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';

import prisma from '../libs/prisma';
import config from '../config';

class AuthService {
  static generateImage(id: number | string) {
    return `https://avatars.dicebear.com/api/big-ears-neutral/${id}.svg`;
  }

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
      role: user.role,
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
        avatar: user.avatar,
      },
    };
  }

  static async logout(id: number) {
    await prisma.user.update({
      where: { id },
      data: { refreshToken: '' },
    });
  }

  static async createInviteToken(email: string, role: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw boom.badRequest('user arleady exist');
    }

    const token = jwt.sign({ role, email }, config.jwtInviteSecret, { expiresIn: '15min' });
    return token;
  }

  static async signup(email: string, password: string, name: string, token: string) {
    try {
      const payload: any = jwt.verify(token, config.jwtInviteSecret);

      if (payload.email.toLocaleLowerCase() !== email.toLocaleLowerCase()) {
        throw boom.unauthorized('invalid data');
      }

      const userExist = await prisma.user.findUnique({
        where: { email },
      });

      if (userExist) {
        throw boom.unauthorized('invalid data');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const seedImage = await bcrypt.hash(email, 2);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          avatar: this.generateImage(seedImage),
          password: hashedPassword,
          role: payload.role,
        },
      });

      const data = await this.signTokens(user);
      return data;
    } catch (error: any) {
      throw boom.unauthorized(error.message);
    }
  }
}

export default AuthService;
