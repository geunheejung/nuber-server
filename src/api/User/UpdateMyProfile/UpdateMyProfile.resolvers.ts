import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse,
} from '../../../types/graph';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        context
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = context.req.user;
        await User.update({ id: user.id }, { ...args });
        return {
          ok: false,
          error: '',
        };
      }
    ),
  },
};

export default resolvers;
