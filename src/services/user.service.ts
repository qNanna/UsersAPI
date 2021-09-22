import { Injectable } from '@nestjs/common';

import dbUsers from 'src/database/userRepository';

@Injectable()
export class UserService {
  async findOne(data: string, prop: string) : Promise<any> {
    const [result] = await dbUsers.findOne(data, prop);
    return result;
  }

  async insert(data: any, prop: string) : Promise<any> {
    return dbUsers.insertToTable({ ...data }, prop);
  }
}