import boom from '@hapi/boom';
import prisma from '../libs/prisma';
// import generateReport from '../libs/jsreport';
import cardRender from '../libs/cardRender';
import sendGridEmail from '../libs/sendGrid';

export type PlayerCreate = {
  firstName: string,
  lastName: string,
  birthday: Date,
  eps: string,
  email: string,
  picture?: string,
  cedula: string,
  phone: string,
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
        images: {
          select: {
            small: true,
            medium: true,
            large: true,
          },
        },
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
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
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
        birthday: new Date(player.birthday),
        creator: {
          connect: {
            id: creatorId,
          },
        },
      },
    });
    return result;
  }

  static async createWithImage(player: PlayerCreate, creatorId: number, images: Images) {
    const result = await prisma.player.create({
      data: {
        ...player,
        birthday: new Date(player.birthday),
        creator: {
          connect: {
            id: creatorId,
          },
        },
        images: {
          create: images,
        },
      },
      include: {
        images: true,
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
          images: {
            select: {
              small: true,
              large: false,
              medium: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
            },
          },
        },
      });
      return player;
    } catch (error) {
      throw boom.notFound('somthing goes worng');
    }
  }

  static async generateCarnet(playerId: number, sendEmail: boolean = false) {
    const player = await this.findOne(playerId);
    // const result = await generateReport(player);
    const result = await cardRender(player);
    if (sendEmail) {
      await sendGridEmail();
    }
    return result;
  }
}

export default PlayersService;
