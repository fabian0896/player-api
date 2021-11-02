import boom from '@hapi/boom';
import prisma from '../libs/prisma';
// import generateReport from '../libs/jsreport';
import cardRender from '../libs/cardRender';
import Mailer from '../libs/nodeMailer';

type CursorObject = {
  cursor?: {
    id: number,
  }
}

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

const mailer = new Mailer();

class PlayersService {
  static async findAll(cursor?: number) {
    const cursorObject: CursorObject = {};
    if (cursor) {
      cursorObject.cursor = {
        id: cursor,
      };
    }
    const players = await prisma.player.findMany({
      skip: cursor ? 1 : 0,
      take: 15,
      ...cursorObject,
      orderBy: {
        id: 'desc',
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

    let myCursor: number | undefined;

    if (players.length >= 15) {
      const lastPlayerInResult = players[players.length - 1];
      myCursor = lastPlayerInResult.id;
    }

    return {
      data: players,
      nextCursor: myCursor,
    };
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

    return {
      data: player,
    };
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

  static async updateWithImage(playerId: number, player: Partial<PlayerCreate>, images: Images) {
    try {
      const result = await prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          ...player,
          images: {
            update: images,
          },
        },
        include: {
          images: true,
        },
      });
      return result;
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
    const { data: playerRes } = await this.findOne(playerId);
    // const result = await generateReport(player);
    const carnet = await cardRender(playerRes);
    if (sendEmail) {
      await mailer.sendFile(playerRes.email, carnet);
    }
    return carnet;
  }

  static async destroy(playerId: number) {
    try {
      const res = await prisma.player.delete({
        where: {
          id: playerId,
        },
      });
      return res;
    } catch (error) {
      throw boom.notFound('player not found');
    }
  }
}

export default PlayersService;
