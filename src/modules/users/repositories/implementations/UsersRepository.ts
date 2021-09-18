import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      relations: ['games'],
      where: { id: user_id },
    }) as User;
    
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const allUserOrdered = this.repository.query(
      `SELECT * FROM users 
       ORDER BY first_name ASC`
    );
    
    return allUserOrdered;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository.query(
      `SELECT * 
       FROM users 
       WHERE LOWER(users.first_name) LIKE $1
       AND LOWER(users.last_name) LIKE $2
       `, [first_name.toLocaleLowerCase(), last_name.toLocaleLowerCase()]
    );

    return user;
  }
}
