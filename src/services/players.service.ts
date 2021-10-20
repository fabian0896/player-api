import boom from '@hapi/boom';
import prisma from '../libs/prisma';

export type PlayerCreate = {
  firstName: string,
  lastName: string,
  birthday: Date,
  eps: string,
  email: string,
  picture?: string
  cedula: number,
}

type Images = {
  small: string
  medium: string
  large: string
}

class PlayersService {
  static async findAll(page: number, size: number = 20) {
    const players = await prisma.player.findMany({
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
      },
    });
    return players;
  }

  static async findOne(playerId: number) {
    const player = await prisma.player.findUnique({
      where: {
        id: playerId,
      },
      include: {
        creator: true,
        images: true,
      },
    });

    if (!player) {
      throw boom.notFound('player not found');
    }

    return player;
  }

  static async create(player: PlayerCreate, creatorId: number) {
    const result = await prisma.player.create({
      data: {
        ...player,
        creator: {
          connect: {
            id: creatorId,
          },
        },
      },
    });
    return result;
  }

  static async update(playerId:number, data: Partial<PlayerCreate>) {
    try {
      const player = await prisma.player.update({
        where: {
          id: playerId,
        },
        data,
      });
      return player;
    } catch (error) {
      throw boom.notFound('player not found');
    }
  }

  static async addImage(playerId: number, images: Images) {
    try {
      const player = await prisma.player.update({
        where: { id: playerId },
        data: {
          images: {
            create: {
              large: images.large,
              medium: images.medium,
              small: images.small,
            },
          },
        },
        include: {
          images: true,
          creator: true,
        },
      });
      return player;
    } catch (error) {
      throw boom.notFound('somthing goes worng');
    }
  }
}

export default PlayersService;
