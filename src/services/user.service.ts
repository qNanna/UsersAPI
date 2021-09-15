import { Injectable } from '@nestjs/common';

import dbUsers from 'src/database/userRepository';

@Injectable()
export class UserService {
  async findOne(data: string, prop: string) : Promise<any> {
    const [result] = await dbUsers.findOne(data, prop);
    return result;
  }

  async insert(data: any, prop: string) : Promise<any> {
    const [insert] = await dbUsers.insertToTable({ ...data }, prop);
    return insert;
  }
}