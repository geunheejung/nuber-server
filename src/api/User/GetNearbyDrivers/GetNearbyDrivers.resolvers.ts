import { Between, getRepository } from 'typeorm';
import User from '../../../entities/User';
import { GetNearbyDriversResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(
      // TODO 근처에 있다(nearby)의 표현 정의
      // nearby.위도 = 위도 - 0.05 ~ 위도 + 0.05
      // nearby.경도 = 경도 - 0.05 ~ 경도 + 0.05
      async (_, __, context): Promise<GetNearbyDriversResponse> => {
        const user: User = context.req.user;
        const { lastLat, lastLng } = user;
        try {
          // find 함수는 오직 getRepository에서만 작동(Data Mapper Pattern)
          const drivers: User[] = await getRepository(User).find({
            isDriving: true,
            lastLat: Between(lastLat - 0.05, lastLat + 0.05),
            lastLng: Between(lastLng - 0.05, lastLng + 0.05),
          });
          return {
            ok: true,
            error: null,
            drivers,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            drivers: null,
          };
        }
      }
    ),
  },
};
export default resolvers;
