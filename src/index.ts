import dotenv from 'dotenv';

dotenv.config();

import { Options } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import ConnectionOptions from './ormConfig';
import app from './app';
import decodeJWT from './utils/decodeJWT';

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';
const SUBSCRIPTION_ENDPOINT: string = '/subscription';

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  // graphql-yoga API에서 WebSocket에 access할 때 사용 가능한 함수를 줌
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async connectionParams => {
      const token = connectionParams['X-JWT'];
      if (token) {
        const user = await decodeJWT(token);
        if (user) {
          return {
            currentUser: user,
          };
        }
      }

      throw new Error('No JWT. Can`t subscribe');
    },
  },
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
