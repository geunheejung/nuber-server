import _isNull from 'lodash/isNull';
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
        const notNull = {};

        for (const key of Object.keys(args)) {
          const item = args[key];
          if (!_isNull(item)) {
            notNull[key] = item;
          }
        }

        try {
          await User.update({ id: user.id }, { ...notNull });
          return {
            ok: true,
            error: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }

        return {
          ok: false,
          error: '',
        };
      }
    ),
  },
};

export default resolvers;
