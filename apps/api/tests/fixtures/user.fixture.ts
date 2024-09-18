import { INestApplication } from '@nestjs/common';
import { User } from '~/entities/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '~/modules/user/user.service';

export class UserFixture {
  private _user: User;

  constructor(user?: Partial<User>) {
    this._user = {
      id: uuidv4(),
      email: 'test@gmail.com',
      password: 'password',
      organizations: [],
      //eslint-disable-next-line
      //@ts-ignore
      session: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...user,
    };
  }

  async saveInDB(app: INestApplication) {
    const userService = app.get(UserService);

    await userService.create(this.user);

    return this;
  }

  get user() {
    return this._user;
  }
}

export const createUserFixture = (user?: Partial<User>) =>
  new UserFixture(user);
