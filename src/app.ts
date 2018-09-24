import helmet from 'helmet';
import logger from 'morgan';
import cors from 'cors';
import { GraphQLServer } from 'graphql-yoga';
import schema from './schema';

class App {
  public app: GraphQLServer;
  constructor() {
    this.app = new GraphQLServer({ schema });
    this.middlewares();
  }

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger('dev'));
    this.app.express.use(helmet());
  };

  /**
   * request: 무엇을 갖고있는지 확인
   * request에 따른 response가 있다면 response를 전송
   * request가 아무것도 갖고있지 않으면 넘어가서 next! 다음 middleware를 실행
   */
  private jwt = async (request, response, next): Promise<void> => {
    const token = request.get('X-JWT');
    if (token) {
    }
  };
}

export default new App().app;
