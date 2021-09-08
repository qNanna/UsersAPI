import { Injectable } from '@nestjs/common';

import { Utils } from 'utils/index';
import config from '../../config/index';
import db from '../../database/userRepository';

@Injectable()
export class UserService {
    public async findOne(data: string, prop: string) : Promise<any> {
        const [result] = await db.findOne(data, prop);
        return result;
      }
    
      async updateValue(id: number, prop: string, value: any) : Promise<any> {
        return db.updateValue(id, prop, value);
      }

      async insert(data: any) : Promise<any> {
        const password = Utils.encryptData(data.password, config.cryptoSecretKey);
        const [insert] = await db.insertToTable({ ...data, password }, 'users');
        return insert;
      }
}

