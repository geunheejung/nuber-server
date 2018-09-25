import helmet from 'helmet';
import logger from 'morgan';
import cors from 'cors';
import { NextFunction, Response } from 'express';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import schema from './schema';
import decodeJWT from './utils/decodeJWT';

class App {
  public app: GraphQLServer;
  public pubSub: any;

  constructor() {
    /*
    server를 킬 때 context를 파라미터로 넘겨줄 수 있는데
    여기서 넘겨주는 값이 resolver에서 context로 받는다.
    모든 resolver로 넘어가기에 넘겨줄때 고유한 key값을 만들어줘야한다.s
    */
    this.pubSub = new PubSub();
    // 아래 설정해주지 않으면 메모리 누수 발생
    this.pubSub.ee.setMaxListeners(99);
    this.app = new GraphQLServer({
      schema,
      context: req => {
        return {
          req: req.request,
          pubSub: this.pubSub,
        };
      },
    });
    this.middlewares();
  }

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger('dev'));
    this.app.express.use(helmet());
    // CUSTOM MIDDLEWARE...
    this.app.express.use(this.jwt);
  };

  /**
   * request: 무엇을 갖고있는지 확인
   * request에 따른 response가 있다면 response를 전송
   * request가 아무것도 갖고있지 않으면 넘어가서 next! 다음 middleware를 실행
   */
  private jwt = async (
    request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    /* TODO
    1. user를 request 안으로 넣는다. -> request는 object이고, user를 기점으로 모든
       middleware를 거쳐 graphql server까지 간다.
      request --> middleware --> server(graphql) 그 이유는 graphql server안에 express가 있기 때문
    2.

    */
    const token = request.get('X-JWT');
    if (token) {
      const user = await decodeJWT(token);

      if (user) {
        request.user = user;
      } else {
        request.user = undefined;
      }
    }

    next();
  };
}

export default new App().app;
