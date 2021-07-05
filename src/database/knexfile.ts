import dotenv from 'dotenv';
import { Knex } from 'knex';
import path from 'path';

if (process.env.NODE_ENV == 'testing') {
  dotenv.config({ path: '.env.testing' });
} else {
  dotenv.config({ path: '../../.env' });
}

const knexConfig: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection:
    process.env.NODE_ENV == 'testing'
      ? ':memory:'
      : {
          database: process.env.DB_DATABASE,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD
        },
  useNullAsDefault: process.env.NODE_ENV == 'testing',
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'migrations')
  }
};

export default knexConfig;
