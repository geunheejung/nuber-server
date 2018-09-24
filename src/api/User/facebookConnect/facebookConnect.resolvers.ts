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
      try {
        const existingUser = await User.findOne({ fbId });
        if (existingUser) {
          return {
            ok: true,
            error: null,
            token: 'Coming soon',
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }

      try {
        const PROFILE_PHOTO_URL = `http://graph.facebook.com/${fbId}/picture?type=square`;

        await User.create({
          ...args,
          profilePhoto: PROFILE_PHOTO_URL,
        }).save();

        return {
          ok: true,
          error: null,
          token: 'Coming soon',
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
