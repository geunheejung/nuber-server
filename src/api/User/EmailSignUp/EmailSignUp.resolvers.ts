import { Resolvers } from '../../../types/resolvers';
import {
  EmailSignUpResponse,
  EmailSignUpMutationArgs,
} from '../../../types/graph';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: 'You should log in instead',
            token: null,
          };
        } else {
          // JWT 작업 시 토큰만들 때 사용됨.
          // const newUser = await User.create({ ...args }).save();
          await User.create({ ...args }).save();
          return {
            ok: true,
            error: null,
            token: 'Comming soon',
          };
        }
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
