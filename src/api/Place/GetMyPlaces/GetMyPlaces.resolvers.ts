import User from '../../../entities/User';
import { GetMyPlacesResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
const resolvers: Resolvers = {
  Query: {
    GetMyPlaces: privateResolver(
      async (_, __, { req }): Promise<GetMyPlacesResponse> => {
        try {
          // 1. context로 받은 user.id 로 user를 찾으면서 해당 user의 relationship field 중 places도 같이 로드함
          const user = await User.findOne(
            { id: req.user.id },
            { relations: ['places'] }
          );
          // 2. user가 존재할 경우
          if (user) {
            return {
              ok: true,
              places: user.places,
              error: null,
            };
          } else {
            return {
              ok: false,
              places: null,
              error: 'User not found',
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            places: null,
          };
        }
      }
    ),
  },
};
export default resolvers;
