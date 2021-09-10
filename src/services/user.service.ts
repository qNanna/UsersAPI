import { Injectable } from '@nestjs/common';

import dbUsers from 'src/database/userRepository';
import dbTokens from 'src/database/tokensRepository'

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

  async updateToken(token: string, id: string) : Promise<any> {
    return dbTokens.update(token, id);
  }

  async findToken(userId: string, prop: string) : Promise<any> {
    const [result] = await dbTokens.findOne(userId, prop);
    return result;
  }

  async insertToken(data: any) : Promise<any> {
    const [insert] = await dbTokens.insertToTable(data);
    return insert;
  }
}

