import prisma from '../libs/prisma';

type PlayerCreate = {
  firstName: string,
  lastName: string,
  birthday: Date,
  eps: string,
  email: string,
  picture?: string
}

class PlayersService {
  static async findAll() {
    const players = await prisma.player.findMany();
    return players;
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
}

export default PlayersService;
