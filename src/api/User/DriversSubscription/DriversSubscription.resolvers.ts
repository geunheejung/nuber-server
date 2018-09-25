import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    DriversSubscription: {
      // withFilter로 ture or false 하면 request를 막을 수 있다.
      // 1. driver가 위치를 보고하면
      // 2. ReportMovement resolvers가 실행
      // 3. ReportMovement resolvers는 결과물을 driverUpdate 채널에 전송
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator('driverUpdate'),
        (payload, _, { context }) => {
          const user: User = context.currentUser;
          const {
            DriversSubscription: {
              lastLat: driverLastLat,
              lastLng: driverLastLng,
            },
          } = payload;
          const { lastLat: userLastLat, lastLng: userLastLng } = user;
          // console.log(driverLastLat, driverLastLng, userLastLat, userLastLng);
          // console.group('------ [DRIVER] ------');
          // console.log('------------------------------');
          // console.log(
          //   'driverLastLat -->',
          //   driverLastLat,
          //   'driverLastLng --> ',
          //   driverLastLng
          // );
          // console.log('------------------------------');
          // console.groupEnd();
          // console.group('------ [USER] ------');
          // console.log('------------------------------');
          // console.log(
          //   'userLastLat -->',
          //   userLastLat,
          //   'userLastLng -->',
          //   userLastLng
          // );
          // console.log('------------------------------');
          // console.groupEnd();
          // console.log(
          //   '[RESULT]',
          //   driverLastLat >= userLastLat - 0.05 &&
          //     driverLastLat <= userLastLat + 0.05 &&
          //     driverLastLng >= userLastLng - 0.05 &&
          //     driverLastLng <= userLastLng + 0.05
          // );
          return (
            driverLastLat >= userLastLat - 0.05 &&
            driverLastLat <= userLastLat + 0.05 &&
            driverLastLng >= userLastLng - 0.05 &&
            driverLastLng <= userLastLng + 0.05
          );
        }
      ),
    },
  },
};

export default resolvers;

/*
  context를 통해 념거받은 pubSub Api의 메서드로 'driverUpdate' 라는 채널을 생성함.
  이제 'driverUpdate' 의 이름과 동일하게 pubSub.publish('driverUpdate') 해주면 생성한 채널을 subscription함.
  subscription 되면 모든 event를 전달받는다.
  */
