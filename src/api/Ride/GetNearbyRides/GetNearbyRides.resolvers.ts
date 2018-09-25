import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import User from '../../../entities/User';
import { getRepository, Between } from 'typeorm';
import Ride from '../../../entities/Ride';
import { GetNearbyRidesResponse } from '../../../types/graph';

const resolvers: Resolvers = {
  Query: {
    GetNearbyRides: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRidesResponse> => {
        const user: User = req.uesr;
        const { lastLat, lastLng } = user;
        // 요청 중 상태이고, 픽업 위치가 사용자 근처인 ride
        if (user.isDriving) {
          try {
            const rides = await getRepository(Ride).find({
              status: 'REQUESTING',
              pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
              pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
            });

            return {
              ok: true,
              error: null,
              rides,
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rides: null,
            };
          }
        } else {
          return {
            ok: false,
            error: 'You are not a driver',
            rides: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
