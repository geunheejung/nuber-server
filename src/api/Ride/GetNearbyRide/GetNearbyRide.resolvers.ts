import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import User from '../../../entities/User';
import { getRepository, Between } from 'typeorm';
import Ride from '../../../entities/Ride';
import { GetNearbyRideResponse } from '../../../types/graph';

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRideResponse> => {
        const user: User = req.uesr;
        const { lastLat, lastLng } = user;
        // 요청 중 상태이고, 픽업 위치가 사용자 근처인 ride
        if (user.isDriving) {
          try {
            const ride = await getRepository(Ride).findOne({
              status: 'REQUESTING',
              pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
              pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
            });

            if (ride) {
              return {
                ok: true,
                error: null,
                ride,
              };
            } else {
              return {
                ok: true,
                error: null,
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
        } else {
          return {
            ok: false,
            error: 'You are not a driver',
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
