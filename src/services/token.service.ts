import { Injectable } from '@nestjs/common';

import dbTokens from 'src/database/tokensRepository'

@Injectable()
export class TokenService {
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
