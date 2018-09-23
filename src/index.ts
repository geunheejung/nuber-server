import dotenv from 'dotenv';

dotenv.config();

import { Options } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import ConnectionOptions from './ormConfig';
import app from './app';

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);


/** App <---- ORM ----> Database
 * orm 은 ormConfig에서 만든 ConnectionOptions로 데이터베아스와 앱을 연결해주는 역할을 한다.
 */
createConnection(ConnectionOptions)
  .then(() => {
    app.start(appOptions, handleAppStart);
  })
  .catch(e => {
    console.error(e);
  });

