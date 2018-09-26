import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { GetRideQueryArgs, GetRideResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';

const resolvers: Resolvers = {
  Query: {
    GetRide: privateResolver(
      async (_, args: GetRideQueryArgs, { req }): Promise<GetRideResponse> => {
        const user: User = req.user;
        try {
          // const relations = { relations: ['passenger', 'driver'] };
          // relations 모든 관계 데이터를 가져오기에 무겁다.
          const ride = await Ride.findOne({
            id: args.rideId,
          });
          if (ride) {
            // 요청하는 유저 or 드라이버가 Ride에 승객으로 또는 드라이버로 존재할 경우
            // 유저가 드라이버 or 승객인지 체크
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              return {
                ok: true,
                error: null,
                ride,
              };
            } else {
              return {
                ok: false,
                error: `Not Authorized`,
                ride: null,
              };
            }
          } else {
            return {
              ok: false,
              error: 'Ride not found',
              ride: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
