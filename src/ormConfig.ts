import { ConnectionOptions } from 'typeorm';

const ConnectionOptions: ConnectionOptions = {
  type: 'postgres',
  database: 'nuber',
  // 서버가 재시작될때마다 동기화
  synchronize: true,
  logging: true,
  //  model이 들어갈 folder
  entities: ['entities/**/*.'],
  host: process.env.DB_ENDPOINT,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
}

export default ConnectionOptions;