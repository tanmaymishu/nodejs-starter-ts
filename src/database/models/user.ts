import UserFactory from '../factories/user.factory';
import Model from './model';

export default class User extends Model {
  static tableName = 'users';

  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;

  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  static factory(amount: number = 0) {
    return new UserFactory(User, amount);
  }
}