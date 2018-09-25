import { Resolvers } from '../../../types/resolvers';
import { GetMyProfileResponse } from '../../../types/graph';
import privateResolver from '../../../utils/privateResolver';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Query: {
    // request --> middleware --> resolver(context)
    GetMyProfile: privateResolver(
      async (_, __, context): Promise<GetMyProfileResponse> => {
        const user: User = context.req.user;

        return {
          ok: true,
          error: null,
          user,
        };
      }
    ),
  },
};

export default resolvers;
