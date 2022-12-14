import db from './index';

class UserRepository {
  async insertToTable(data = 'empty', tableName = 'users') : Promise<any> {
    return db(tableName).insert(data);
  }

  async findOne(value: string, prop = 'email', tableName = 'users') : Promise<any> {
    return db(tableName).select('*').where(prop, value).limit(1);
  }

  async find(value: string, tableName = 'users', prop = 'email') : Promise<any> {
    return db(tableName).select('*').where(prop, value);
  }
}

export default new UserRepository();
