import { Resolvers } from '../../../types/resolvers';
import User from '../../../entities/User';
import {
  FacebookConnectMutationArgs,
  FacebookConnectResponse,
} from '../../../types/graph';

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (
      _,
      args: FacebookConnectMutationArgs
    ): Promise<FacebookConnectResponse> => {
      const { fbId } = args;
      // typeorm 사용 시 try - catch 로 감싸면 error를 잡기가 쉽다.
      try {
        // 이미 존재할 경우
        const existingUser = await User.findOne({ fbId });
        if (existingUser) {
          return {
            ok: true,
            error: null,
            token: 'Coming soon, already',
          };
        }
      } catch (error) {
        console.log('error ::', error);
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }

      // 새로 생성
      try {
        const PROFILE_PHOTO_URL = `http://graph.facebook.com/${fbId}/picture?type=square`;

        await User.create({
          ...args,
          profilePhoto: PROFILE_PHOTO_URL,
        }).save();

        return {
          ok: true,
          error: null,
          token: 'Coming soon, start',
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;
