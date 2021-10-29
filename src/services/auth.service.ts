import { Prisma, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';

import prisma from '../libs/prisma';
import config from '../config';

type UpdateData = {
  email: string,
  role: 'admin' | 'reader' | 'editor',
  active: boolean,
};

class AuthService {
  static generateImage(id: number | string) {
    return `https://avatars.dicebear.com/api/big-ears-neutral/${id}.svg`;
  }

  static async createUser(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
    return user;
  }

  static async update(userId: number, data: UpdateData) {
    try {
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data,
        select: {
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          avatar: true,
        },
      });
      return user;
    } catch (error) {
      throw boom.notFound('user does not exist');
    }
  }

  static async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  static async findAll(userId?: number) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        avatar: true,
        active: true,
        createdAt: true,
      },
    });
    return users;
  }

  static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
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
        email: email.toLowerCase(),
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
        where: { email: email.toLowerCase() },
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
