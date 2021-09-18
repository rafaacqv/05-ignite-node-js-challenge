import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .where(`LOWER(games.title) LIKE :name`, {name: `%${param.toLowerCase()}%` })
      .printSql()
      .getMany();
    
      return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(
      `SELECT COUNT(*) FROM games`
    ); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const gameWithUsers = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "users")
      .where(`games.id = :id`, { id })
      .getOne()

    const users = gameWithUsers?.users as User[];
    return users;
  }
}
