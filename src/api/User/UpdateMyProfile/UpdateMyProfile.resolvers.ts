import _isNull from 'lodash/isNull';
import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse,
} from '../../../types/graph';
import User from '../../../entities/User';

const getNotNullObj = (obj: object): object => {
  const resultNotNull: object = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!_isNull(value)) {
      resultNotNull[key] = value;
    }
  }

  return resultNotNull;
};

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        context
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = context.req.user;
        const notNull: any = getNotNullObj(args);

        if (!_isNull(notNull.password)) {
          user.password = notNull.password;
          user.save();
          delete notNull.password;
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
